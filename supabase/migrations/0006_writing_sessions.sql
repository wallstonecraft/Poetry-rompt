-- "Time spent writing" for About You. Deliberately minimal: a session is
-- just a start/end timestamp pair around the write screen being open,
-- recorded by the client on mount/unmount. A session with no ended_at
-- (hard refresh, tab close, crash) is excluded from totals rather than
-- estimated -- undercounting is fine for a quiet, approximate stat.

create table writing_sessions (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles (id) on delete cascade,
  poem_id uuid references poems (id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create index writing_sessions_author_idx on writing_sessions (author_id);

alter table writing_sessions enable row level security;

create policy "writing_sessions_select_own" on writing_sessions
  for select to authenticated
  using (author_id = auth.uid());

create policy "writing_sessions_insert_own" on writing_sessions
  for insert to authenticated
  with check (author_id = auth.uid());

create policy "writing_sessions_update_own" on writing_sessions
  for update to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());
