-- Family Hub — run once in Supabase SQL Editor.
-- REPLACE family@example.com (2 places) with the family login email you created.
create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  coll text not null,
  data jsonb not null default '{}',
  created_at timestamptz default now()
);
alter table items enable row level security;
drop policy if exists "family read" on items;
drop policy if exists "family insert" on items;
drop policy if exists "family update" on items;
drop policy if exists "family delete" on items;
drop policy if exists "family only" on items;
revoke all on items from anon;
create policy "family only" on items for all to authenticated
  using ((auth.jwt()->>'email') = 'family@example.com')
  with check ((auth.jwt()->>'email') = 'family@example.com');
alter table items replica identity full;
