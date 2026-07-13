-- Poetry Prompt — row-level security
-- "Drafts are only visible to their author" is enforced here, at the database
-- layer, not by anything the client chooses to fetch.

alter table profiles enable row level security;
alter table prompt_categories enable row level security;
alter table prompts enable row level security;
alter table competitions enable row level security;
alter table poems enable row level security;
alter table daily_inspirations enable row level security;
alter table featured_poets enable row level security;
alter table follows enable row level security;
alter table appreciations enable row level security;
alter table app_opens enable row level security;
alter table poem_reads enable row level security;
alter table notifications enable row level security;
alter table user_settings enable row level security;
alter table reports enable row level security;

-- ---------------------------------------------------------------------------
-- profiles — bylines/avatars are visible to any signed-in user; only the
-- owner can change their own row. Rows are normally created by the
-- handle_new_user trigger (runs as the function owner, bypassing RLS).
-- ---------------------------------------------------------------------------
create policy "profiles_select_authenticated" on profiles
  for select to authenticated using (true);

create policy "profiles_insert_own" on profiles
  for insert to authenticated with check (id = auth.uid());

create policy "profiles_update_own" on profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- ---------------------------------------------------------------------------
-- Editorial / curated read-only content: prompts, categories, competitions,
-- daily inspirations, featured poets. No client writes — seeded and
-- maintained via the service role.
-- ---------------------------------------------------------------------------
create policy "prompt_categories_select_authenticated" on prompt_categories
  for select to authenticated using (true);

create policy "prompts_select_authenticated" on prompts
  for select to authenticated using (true);

create policy "competitions_select_authenticated" on competitions
  for select to authenticated using (true);

create policy "daily_inspirations_select_authenticated" on daily_inspirations
  for select to authenticated using (true);

create policy "featured_poets_select_authenticated" on featured_poets
  for select to authenticated using (true);

-- ---------------------------------------------------------------------------
-- poems — the core privacy boundary. A poem is visible if it's published
-- (including editorial rows, which are always published) or if the reader
-- is its author. Owners may only update their own poem while it's still a
-- draft: once status flips to 'published' the USING clause no longer
-- matches, so there is no code path back to private (no unpublish).
-- ---------------------------------------------------------------------------
create policy "poems_select_published_or_own" on poems
  for select to authenticated using (status = 'published' or author_id = auth.uid());

create policy "poems_insert_own" on poems
  for insert to authenticated with check (author_id = auth.uid() and not is_editorial);

create policy "poems_update_own_draft" on poems
  for update to authenticated
  using (author_id = auth.uid() and status = 'draft')
  with check (author_id = auth.uid());

-- ---------------------------------------------------------------------------
-- follows — a user manages only their own follow edges. No follower/following
-- counts are ever queried, so no broader select policy is needed.
-- ---------------------------------------------------------------------------
create policy "follows_select_own" on follows
  for select to authenticated using (follower_id = auth.uid());

create policy "follows_insert_own" on follows
  for insert to authenticated with check (follower_id = auth.uid());

create policy "follows_delete_own" on follows
  for delete to authenticated using (follower_id = auth.uid());

-- ---------------------------------------------------------------------------
-- appreciations — the heart/like. No count is ever shown, so a user only
-- ever needs to read their own appreciation rows (to know if they've liked
-- something). Can only like a published poem.
-- ---------------------------------------------------------------------------
create policy "appreciations_select_own" on appreciations
  for select to authenticated using (user_id = auth.uid());

create policy "appreciations_insert_own" on appreciations
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (select 1 from poems p where p.id = poem_id and p.status = 'published')
  );

create policy "appreciations_delete_own" on appreciations
  for delete to authenticated using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- app_opens / poem_reads — private activity logs behind the Home stats card
-- and the streak-risk notification. Never readable by anyone but the user.
-- ---------------------------------------------------------------------------
create policy "app_opens_select_own" on app_opens
  for select to authenticated using (user_id = auth.uid());

create policy "app_opens_insert_own" on app_opens
  for insert to authenticated with check (user_id = auth.uid());

create policy "poem_reads_select_own" on poem_reads
  for select to authenticated using (user_id = auth.uid());

create policy "poem_reads_insert_own" on poem_reads
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (select 1 from poems p where p.id = poem_id and p.status = 'published')
  );

-- ---------------------------------------------------------------------------
-- notifications — read/mark-as-read only; rows are only ever created by the
-- trigger functions in 0002 (security definer, bypasses RLS as the owner).
-- ---------------------------------------------------------------------------
create policy "notifications_select_own" on notifications
  for select to authenticated using (recipient_id = auth.uid());

create policy "notifications_update_own" on notifications
  for update to authenticated
  using (recipient_id = auth.uid())
  with check (recipient_id = auth.uid());

-- ---------------------------------------------------------------------------
-- user_settings — Settings screen: reminder cadence + streak nudge toggle.
-- ---------------------------------------------------------------------------
create policy "user_settings_select_own" on user_settings
  for select to authenticated using (user_id = auth.uid());

create policy "user_settings_insert_own" on user_settings
  for insert to authenticated with check (user_id = auth.uid());

create policy "user_settings_update_own" on user_settings
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- reports — quiet moderation queue. A reporter can file and see their own
-- reports; nobody can read reports filed against them or by other users
-- (moderation review happens via the service role, outside the app).
-- ---------------------------------------------------------------------------
create policy "reports_select_own" on reports
  for select to authenticated using (reporter_id = auth.uid());

create policy "reports_insert_own" on reports
  for insert to authenticated with check (reporter_id = auth.uid());
