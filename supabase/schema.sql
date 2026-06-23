-- Sprout — Supabase schema
--
-- One table for now: the public landing-page waitlist.
-- Founding Members purchases are tracked in Stripe, not here.
--
-- This file is the source of truth for the DB shape. If you change
-- it, run the new SQL in the Supabase dashboard's SQL editor against
-- the project pointed to by NEXT_PUBLIC_SUPABASE_URL.

-- ─────────────────────────────────────────────────────────────────
-- waitlist
-- One row per email signup from the landing page. Insert-only for
-- the anonymous role used by the browser bundle; reads require the
-- service_role key (server-side / dashboard only).
-- ─────────────────────────────────────────────────────────────────

create table if not exists public.waitlist (
  id         uuid        primary key default gen_random_uuid(),
  email      text        not null,
  created_at timestamptz not null    default now(),
  constraint waitlist_email_unique unique (email)
);

create index if not exists waitlist_created_at_idx
  on public.waitlist (created_at desc);

-- Row Level Security: REQUIRED. Without these policies the table is
-- either inaccessible (RLS on, no policies) or readable by anyone with
-- the anon key (RLS off — bad, because the anon key is in the browser
-- bundle).

alter table public.waitlist enable row level security;

-- Allow anon + authenticated callers to INSERT a signup row.
-- They cannot SELECT, UPDATE, or DELETE — that requires the
-- service_role key (which is NOT exposed in the browser).
drop policy if exists "Anyone can join the waitlist" on public.waitlist;
create policy "Anyone can join the waitlist"
  on public.waitlist
  for insert
  to anon, authenticated
  with check (true);

-- ─────────────────────────────────────────────────────────────────
-- Resources social layer (community comments, forum, upvotes)
--
-- Powers the Reddit-style social layer on /resources: published
-- community worksheets, a discussion forum, threaded comments,
-- upvotes, reports, and a global kill switch.
--
-- IMPORTANT: every table below is RLS-ENABLED WITH NO POLICIES on
-- purpose. The browser anon key (lib/supabase.ts) therefore cannot
-- read or write ANY of it. All access is server-side only, via the
-- service-role key (SUPABASE_SERVICE_ROLE_KEY), which bypasses RLS.
-- See lib/resources/social-server.ts and app/api/resources/*.
--
-- Run this whole block in the Supabase SQL editor against the project
-- pointed to by NEXT_PUBLIC_SUPABASE_URL.
-- ─────────────────────────────────────────────────────────────────

-- makers: one row per anonymous browser identity (CreatorProfile.id).
-- The id is generated client-side and upserted on every write.
create table if not exists public.resource_makers (
  id           uuid        primary key,
  handle       text        not null,
  display_name text        not null,
  photo        text,
  bio          text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists resource_makers_handle_idx on public.resource_makers (handle);

-- posts: a published "custom" (build-your-own) worksheet, shared to the
-- community. handle/creator_name are denormalized snapshots so list and
-- permalink reads are a single table query (no join).
create table if not exists public.resource_posts (
  id            uuid        primary key default gen_random_uuid(),
  maker_id      uuid        not null references public.resource_makers(id) on delete cascade,
  handle        text        not null,
  creator_name  text        not null,
  title         text        not null,
  subtitle      text        not null default '',
  template_id   text        not null,                 -- always 'custom' (enforced server-side)
  topic         text        not null,                 -- topicForTemplate() snapshot, for filtering
  worksheet     jsonb       not null,                 -- the full Worksheet JSON
  upvotes       integer     not null default 0,       -- maintained by trigger
  comment_count integer     not null default 0,       -- maintained by trigger
  hidden        boolean     not null default false,   -- soft-delete (moderation)
  created_at    timestamptz not null default now()
);
create index if not exists resource_posts_created_idx on public.resource_posts (created_at desc) where hidden = false;
create index if not exists resource_posts_maker_idx   on public.resource_posts (maker_id, created_at desc);
create index if not exists resource_posts_topic_idx   on public.resource_posts (topic, created_at desc) where hidden = false;

-- threads: forum discussion posts (the public feedback surface).
create table if not exists public.resource_threads (
  id            uuid        primary key default gen_random_uuid(),
  maker_id      uuid        not null references public.resource_makers(id) on delete cascade,
  handle        text        not null,
  creator_name  text        not null,
  title         text        not null,
  body          text        not null default '',
  upvotes       integer     not null default 0,
  comment_count integer     not null default 0,
  hidden        boolean     not null default false,
  created_at    timestamptz not null default now()
);
create index if not exists resource_threads_created_idx on public.resource_threads (created_at desc) where hidden = false;
create index if not exists resource_threads_top_idx     on public.resource_threads (upvotes desc, created_at desc) where hidden = false;

-- comments: threaded, polymorphic to a post OR a thread, self-referential
-- for Reddit-style replies.
create table if not exists public.resource_comments (
  id           uuid        primary key default gen_random_uuid(),
  target_type  text        not null check (target_type in ('post','thread')),
  target_id    uuid        not null,
  parent_id    uuid        references public.resource_comments(id) on delete cascade,
  maker_id     uuid        not null references public.resource_makers(id) on delete cascade,
  handle       text        not null,
  creator_name text        not null,
  body         text        not null,
  upvotes      integer     not null default 0,
  hidden       boolean     not null default false,
  created_at   timestamptz not null default now()
);
create index if not exists resource_comments_target_idx on public.resource_comments (target_type, target_id, created_at);
create index if not exists resource_comments_parent_idx on public.resource_comments (parent_id);

-- votes: generic upvote, unique per (target, maker). Powers idempotent toggle.
create table if not exists public.resource_votes (
  id          uuid        primary key default gen_random_uuid(),
  target_type text        not null check (target_type in ('post','thread','comment')),
  target_id   uuid        not null,
  maker_id    uuid        not null references public.resource_makers(id) on delete cascade,
  created_at  timestamptz not null default now(),
  constraint resource_votes_unique unique (target_type, target_id, maker_id)
);
create index if not exists resource_votes_target_idx on public.resource_votes (target_type, target_id);

-- reports: a moderation signal row (a queue read directly in Supabase).
create table if not exists public.resource_reports (
  id          uuid        primary key default gen_random_uuid(),
  target_type text        not null check (target_type in ('post','thread','comment')),
  target_id   uuid        not null,
  maker_id    uuid        references public.resource_makers(id) on delete set null,
  reason      text,
  resolved    boolean     not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists resource_reports_open_idx on public.resource_reports (created_at desc) where resolved = false;

-- settings: singleton (id=1) holding the global kill switch.
create table if not exists public.resource_settings (
  id             integer     primary key default 1,
  social_enabled boolean     not null default true,
  updated_at     timestamptz not null default now(),
  constraint resource_settings_singleton check (id = 1)
);
insert into public.resource_settings (id, social_enabled)
  values (1, true) on conflict (id) do nothing;

-- Keep the denormalized upvotes count in sync as votes are added/removed.
create or replace function public.resource_apply_vote() returns trigger
  language plpgsql as $$
declare d integer; tt text; tid uuid;
begin
  if (tg_op = 'INSERT') then d := 1;  tt := new.target_type; tid := new.target_id;
  else                        d := -1; tt := old.target_type; tid := old.target_id;
  end if;
  if    tt = 'post'    then update public.resource_posts    set upvotes = greatest(0, upvotes + d) where id = tid;
  elsif tt = 'thread'  then update public.resource_threads  set upvotes = greatest(0, upvotes + d) where id = tid;
  elsif tt = 'comment' then update public.resource_comments set upvotes = greatest(0, upvotes + d) where id = tid;
  end if;
  return null;
end $$;
drop trigger if exists resource_votes_count on public.resource_votes;
create trigger resource_votes_count
  after insert or delete on public.resource_votes
  for each row execute function public.resource_apply_vote();

-- Keep comment_count in sync on the parent post/thread.
create or replace function public.resource_apply_comment() returns trigger
  language plpgsql as $$
declare d integer; tt text; tid uuid;
begin
  if (tg_op = 'INSERT') then d := 1;  tt := new.target_type; tid := new.target_id;
  else                        d := -1; tt := old.target_type; tid := old.target_id;
  end if;
  if    tt = 'post'   then update public.resource_posts   set comment_count = greatest(0, comment_count + d) where id = tid;
  elsif tt = 'thread' then update public.resource_threads set comment_count = greatest(0, comment_count + d) where id = tid;
  end if;
  return null;
end $$;
drop trigger if exists resource_comments_count on public.resource_comments;
create trigger resource_comments_count
  after insert or delete on public.resource_comments
  for each row execute function public.resource_apply_comment();

-- RLS: enable on every social table with NO policies, so the anon browser
-- key is fully denied. Server routes use the service-role key (bypasses RLS).
alter table public.resource_makers   enable row level security;
alter table public.resource_posts    enable row level security;
alter table public.resource_threads  enable row level security;
alter table public.resource_comments enable row level security;
alter table public.resource_votes    enable row level security;
alter table public.resource_reports  enable row level security;
alter table public.resource_settings enable row level security;
