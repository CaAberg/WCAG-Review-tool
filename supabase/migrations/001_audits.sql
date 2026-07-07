-- Supabase schema for optional audit persistence.
-- Run this in the Supabase SQL editor when configuring auth.

create table if not exists public.audits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  title text not null,
  code text not null,
  findings jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.audits enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert on public.audits to anon, authenticated;

create policy "Anyone can insert audits"
  on public.audits for insert
  with check (true);

create policy "Anyone can read audits"
  on public.audits for select
  using (true);
