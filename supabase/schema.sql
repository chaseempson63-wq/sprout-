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
