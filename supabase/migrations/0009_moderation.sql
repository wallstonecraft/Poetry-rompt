-- Moderation review flow: an admin flag, a written record on every report
-- (status + outcome), and the minimum set of actions a moderator needs --
-- remove content, warn, suspend, dismiss -- each atomically resolving the
-- report it came from.

-- ---------------------------------------------------------------------------
-- is_admin / suspended_at: unlike author_note (a single well-defined RPC
-- field), these need per-ROW differentiation -- the "authenticated" role is
-- shared by everyone, so a column-level REVOKE can't tell an admin's own
-- update from anyone else's. A BEFORE UPDATE trigger does that check
-- instead: touching either column is only allowed when the acting user is
-- already an admin. Table-wide UPDATE was never narrowed for profiles, so
-- both new columns already inherit that grant -- no GRANT statement needed.
-- ---------------------------------------------------------------------------
alter table profiles add column is_admin boolean not null default false;
alter table profiles add column suspended_at timestamptz;

-- auth.uid() is null when this runs outside the authenticated-role/RLS
-- context entirely -- i.e. you, directly in the Supabase SQL editor as
-- postgres, which is how the very first admin gets bootstrapped. Any real
-- user session always carries a JWT, so auth.uid() is never null there --
-- that path is the one this trigger actually needs to police.
create or replace function prevent_self_admin_escalation()
returns trigger language plpgsql
as $$
begin
  if (new.is_admin is distinct from old.is_admin or new.suspended_at is distinct from old.suspended_at)
     and auth.uid() is not null
     and not exists (select 1 from profiles where id = auth.uid() and is_admin) then
    raise exception 'only an admin can change is_admin or suspended_at';
  end if;
  return new;
end;
$$;

create trigger profiles_protect_admin_columns
  before update on profiles
  for each row execute function prevent_self_admin_escalation();

-- Suspension is content-level only: a suspended author's published poems
-- stop appearing to anyone else, and they can no longer publish (or edit)
-- poems -- but they can still see their own work and log in. Full auth
-- lockout isn't achievable from the authenticated role (no service key),
-- so this is the actual on/off switch.
drop policy "poems_select_published_or_own" on poems;
create policy "poems_select_published_or_own" on poems
  for select to authenticated
  using (
    (status = 'published' and not exists (
      select 1 from profiles p where p.id = poems.author_id and p.suspended_at is not null
    ))
    or author_id = auth.uid()
  );

-- Also close the insert path: without this, a suspended user could publish
-- by inserting a row with status='published' directly, skipping the
-- draft-then-update flow the update policy above actually polices.
drop policy "poems_insert_own" on poems;
create policy "poems_insert_own" on poems
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and not is_editorial
    and (
      status = 'draft'
      or not exists (select 1 from profiles p where p.id = auth.uid() and p.suspended_at is not null)
    )
  );

drop policy "poems_update_own_draft" on poems;
create policy "poems_update_own_draft" on poems
  for update to authenticated
  using (author_id = auth.uid() and status = 'draft')
  with check (
    author_id = auth.uid()
    and not exists (select 1 from profiles p where p.id = auth.uid() and p.suspended_at is not null)
  );

-- Admin can remove any poem -- no delete policy on poems existed before this.
create policy "poems_delete_admin" on poems
  for delete to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and is_admin));

-- ---------------------------------------------------------------------------
-- reports: status + a written outcome, readable and actionable by an admin.
-- The existing reports_select_own / reports_insert_own policies are
-- untouched -- reporters still can't see anyone else's reports.
-- ---------------------------------------------------------------------------
alter table reports add column status text not null default 'open' check (status in ('open', 'actioned', 'dismissed'));
alter table reports add column outcome text;
alter table reports add column actioned_by uuid references profiles (id);
alter table reports add column actioned_at timestamptz;

create policy "reports_select_admin" on reports
  for select to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and is_admin));

create policy "reports_update_admin" on reports
  for update to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and is_admin))
  with check (exists (select 1 from profiles where id = auth.uid() and is_admin));

-- ---------------------------------------------------------------------------
-- moderation_warning notifications: reuses the existing table: a system
-- notification with no actor, same as streak_risk, plus a message column
-- (nullable, only ever populated for this type) so a warning can carry a
-- specific reason.
-- ---------------------------------------------------------------------------
alter table notifications drop constraint notifications_type_check;
alter table notifications add constraint notifications_type_check
  check (type in ('appreciation', 'follow', 'streak_risk', 'moderation_warning'));
alter table notifications add column message text;

-- ---------------------------------------------------------------------------
-- Admin actions -- each SECURITY DEFINER function checks is_admin itself
-- (same "trust the function, not the client" pattern as
-- get_my_poem_note/set_my_poem_note) and resolves the report atomically
-- with the action it took, so there's never a report left "actioned" with
-- no corresponding effect or vice versa.
-- ---------------------------------------------------------------------------
create or replace function admin_dismiss_report(p_report_id uuid, p_outcome text)
returns void language plpgsql security definer set search_path = public
as $$
begin
  if not exists (select 1 from profiles where id = auth.uid() and is_admin) then
    raise exception 'not authorized';
  end if;
  update reports set status = 'dismissed', outcome = p_outcome, actioned_by = auth.uid(), actioned_at = now()
  where id = p_report_id;
end;
$$;

create or replace function admin_remove_reported_poem(p_report_id uuid, p_outcome text)
returns void language plpgsql security definer set search_path = public
as $$
declare
  v_poem_id uuid;
begin
  if not exists (select 1 from profiles where id = auth.uid() and is_admin) then
    raise exception 'not authorized';
  end if;
  select poem_id into v_poem_id from reports where id = p_report_id;
  if v_poem_id is null then
    raise exception 'report has no associated poem';
  end if;
  delete from poems where id = v_poem_id;
  update reports set status = 'actioned', outcome = p_outcome, actioned_by = auth.uid(), actioned_at = now()
  where id = p_report_id;
end;
$$;

create or replace function admin_suspend_reported_account(p_report_id uuid, p_outcome text)
returns void language plpgsql security definer set search_path = public
as $$
declare
  v_target uuid;
begin
  if not exists (select 1 from profiles where id = auth.uid() and is_admin) then
    raise exception 'not authorized';
  end if;
  select coalesce(reported_poet_id, (select author_id from poems where id = reports.poem_id))
  into v_target from reports where id = p_report_id;
  if v_target is null then
    raise exception 'could not resolve the reported account';
  end if;
  update profiles set suspended_at = now() where id = v_target;
  update reports set status = 'actioned', outcome = p_outcome, actioned_by = auth.uid(), actioned_at = now()
  where id = p_report_id;
end;
$$;

create or replace function admin_warn_reported_account(p_report_id uuid, p_message text)
returns void language plpgsql security definer set search_path = public
as $$
declare
  v_target uuid;
  v_poem uuid;
begin
  if not exists (select 1 from profiles where id = auth.uid() and is_admin) then
    raise exception 'not authorized';
  end if;
  select poem_id, coalesce(reported_poet_id, (select author_id from poems where id = reports.poem_id))
  into v_poem, v_target from reports where id = p_report_id;
  if v_target is null then
    raise exception 'could not resolve the reported account';
  end if;
  insert into notifications (recipient_id, type, poem_id, message) values (v_target, 'moderation_warning', v_poem, p_message);
  update reports set status = 'actioned', outcome = coalesce(p_message, 'Warned'), actioned_by = auth.uid(), actioned_at = now()
  where id = p_report_id;
end;
$$;

grant execute on function admin_dismiss_report(uuid, text) to authenticated;
grant execute on function admin_remove_reported_poem(uuid, text) to authenticated;
grant execute on function admin_suspend_reported_account(uuid, text) to authenticated;
grant execute on function admin_warn_reported_account(uuid, text) to authenticated;
