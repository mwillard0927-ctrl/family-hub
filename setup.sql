-- Run once in Supabase: SQL Editor → New query → paste → Run
create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  coll text not null,
  data jsonb not null default '{}',
  created_at timestamptz default now()
);
alter table items enable row level security;
create policy "family read"   on items for select using (true);
create policy "family insert" on items for insert with check (true);
create policy "family update" on items for update using (true);
create policy "family delete" on items for delete using (true);
alter table items replica identity full;
alter publication supabase_realtime add table items;
