-- Notes / fragments (DESIGN.md "Writing & practice layer" #2). A deliberately
-- separate object type, not a poem with status: 'fragment' — plain text, no
-- title, no spans/marks. Never directly publishable; the only way out is
-- promotion into a freeform draft (see promoted_to_poem_id).

create table fragments (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles (id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now(),
  last_shown_at timestamptz,
  promoted_to_poem_id uuid references poems (id)
);

create index fragments_author_idx on fragments (author_id);

-- Same privacy pattern as draft poems: strictly author-only, and (also like
-- poems) no delete policy — promotion is one-directional and the record is
-- kept, never removed, so there's no legitimate client-side delete path.
alter table fragments enable row level security;

create policy "fragments_select_own" on fragments
  for select to authenticated using (author_id = auth.uid());

create policy "fragments_insert_own" on fragments
  for insert to authenticated with check (author_id = auth.uid());

create policy "fragments_update_own" on fragments
  for update to authenticated using (author_id = auth.uid()) with check (author_id = auth.uid());
