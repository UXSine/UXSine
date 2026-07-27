-- Becoming — Supabase schema
-- Run this in the Supabase SQL editor (or `supabase db push`) before setting
-- VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in the app.
--
-- Auth model: the app signs each device in with anonymous auth, so every row is
-- scoped to auth.uid(). RLS ensures a user can only ever see their own data even
-- though the anon key ships in the client bundle.

-- Also enable anonymous sign-ins:
--   Dashboard -> Authentication -> Providers -> Anonymous sign-ins -> ON

create extension if not exists "pgcrypto";

-- 1. Profile carries the WOOP identity + the paused flag (one row per user).
create table if not exists public.profiles (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  wish       text,
  outcome    text,
  obstacle   text,
  plan       text,
  identity   text,
  paused     boolean not null default false,
  updated_at timestamptz not null default now()
);

-- 2. Daily logs. status is intentionally not color-coded anywhere in the UI.
create table if not exists public.logs (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  date         date not null,
  status       text not null check (status in ('complete', 'miss', 'paused')),
  attribution  text,
  plan_forward text,
  created_at   timestamptz not null default now(),
  unique (user_id, date)
);

-- 3. SRBAI pulses. items = the four 1–5 tap-scale answers.
create table if not exists public.pulses (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  at         timestamptz not null default now(),
  items      smallint[] not null,
  created_at timestamptz not null default now()
);

create index if not exists logs_user_date_idx on public.logs (user_id, date);
create index if not exists pulses_user_at_idx on public.pulses (user_id, at);

-- Row-Level Security -------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.logs enable row level security;
alter table public.pulses enable row level security;

do $$
declare t text;
begin
  foreach t in array array['profiles', 'logs', 'pulses'] loop
    execute format('drop policy if exists "own rows select" on public.%I', t);
    execute format('drop policy if exists "own rows insert" on public.%I', t);
    execute format('drop policy if exists "own rows update" on public.%I', t);
    execute format('drop policy if exists "own rows delete" on public.%I', t);

    execute format(
      'create policy "own rows select" on public.%I for select using (auth.uid() = user_id)', t);
    execute format(
      'create policy "own rows insert" on public.%I for insert with check (auth.uid() = user_id)', t);
    execute format(
      'create policy "own rows update" on public.%I for update using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
    execute format(
      'create policy "own rows delete" on public.%I for delete using (auth.uid() = user_id)', t);
  end loop;
end $$;
