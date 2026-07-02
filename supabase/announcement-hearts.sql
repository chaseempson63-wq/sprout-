-- Hearts on Sprout Team announcements.
-- Run this once in the Supabase SQL editor (prod project) to enable the heart
-- reactions on the Community > Announcements tab. Same shape as resource_follows:
-- the count is count(*) per announcement_id, made idempotent by the unique
-- constraint, so the API's insert-or-delete toggle is safe. RLS on with no
-- policies (the anon key is denied); server routes use the service-role key.

create table if not exists public.resource_announcement_hearts (
  id              uuid        primary key default gen_random_uuid(),
  announcement_id text        not null,
  maker_id        uuid        not null references public.resource_makers (id) on delete cascade,
  created_at      timestamptz not null default now(),
  constraint resource_announcement_hearts_unique unique (announcement_id, maker_id)
);

create index if not exists resource_announcement_hearts_idx
  on public.resource_announcement_hearts (announcement_id);

alter table public.resource_announcement_hearts enable row level security;
