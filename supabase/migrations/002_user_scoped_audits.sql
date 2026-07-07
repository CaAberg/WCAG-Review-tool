-- User-scoped audit access: only owners can read/insert their audits.
-- Run in Supabase SQL Editor after 001_audits.sql.

drop policy if exists "Anyone can insert audits" on public.audits;
drop policy if exists "Anyone can read audits" on public.audits;

revoke all on public.audits from anon;

grant select, insert on public.audits to authenticated;

create policy "Users can insert own audits"
  on public.audits for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can read own audits"
  on public.audits for select
  to authenticated
  using (auth.uid() = user_id);
