-- Poetry Prompt — trigger-based population (profiles, notifications, streak check)
-- and server-side validation of the spans/marks schema.

-- ---------------------------------------------------------------------------
-- Rendering safety: reject any mark outside ["bold", "italic"] at the DB
-- layer, not just in the renderer. See DESIGN.md "Rendering safety".
-- ---------------------------------------------------------------------------
create or replace function validate_poem_content()
returns trigger as $$
declare
  line jsonb;
  span jsonb;
  mark text;
begin
  if jsonb_typeof(new.content -> 'lines') is distinct from 'array' then
    raise exception 'poem content must have a "lines" array';
  end if;

  for line in select * from jsonb_array_elements(new.content -> 'lines') loop
    if jsonb_typeof(line -> 'spans') is distinct from 'array' then
      raise exception 'each line must have a "spans" array';
    end if;

    for span in select * from jsonb_array_elements(line -> 'spans') loop
      if jsonb_typeof(span -> 'text') is distinct from 'string' then
        raise exception 'each span must have string "text"';
      end if;
      if jsonb_typeof(span -> 'marks') is distinct from 'array' then
        raise exception 'each span must have a "marks" array';
      end if;

      for mark in select jsonb_array_elements_text(span -> 'marks') loop
        if mark not in ('bold', 'italic') then
          raise exception 'invalid mark: % (only "bold" and "italic" are valid)', mark;
        end if;
      end loop;
    end loop;
  end loop;

  return new;
end;
$$ language plpgsql;

create trigger poems_validate_content
  before insert or update of content on poems
  for each row execute function validate_poem_content();

-- ---------------------------------------------------------------------------
-- updated_at bookkeeping
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger poems_set_updated_at
  before update on poems
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- New auth.users row -> profiles + user_settings row.
-- ---------------------------------------------------------------------------
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)));

  insert into public.user_settings (user_id) values (new.id);

  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------------
-- Notifications are populated by the event itself, not a UI-only feature.
-- ---------------------------------------------------------------------------
create or replace function notify_on_appreciation()
returns trigger as $$
declare
  v_author_id uuid;
begin
  select author_id into v_author_id from poems where id = new.poem_id;

  if v_author_id is not null and v_author_id <> new.user_id then
    insert into notifications (recipient_id, type, actor_id, poem_id)
    values (v_author_id, 'appreciation', new.user_id, new.poem_id);
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger appreciations_notify
  after insert on appreciations
  for each row execute function notify_on_appreciation();

create or replace function notify_on_follow()
returns trigger as $$
begin
  insert into notifications (recipient_id, type, actor_id)
  values (new.followee_id, 'follow', new.follower_id);

  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger follows_notify
  after insert on follows
  for each row execute function notify_on_follow();

-- ---------------------------------------------------------------------------
-- Streak-at-risk check: one evening reminder, only for users who haven't
-- opened the app today and have the streak reminder enabled. Meant to run
-- once daily via pg_cron (scheduled below, if the extension is available).
-- ---------------------------------------------------------------------------
create or replace function check_streaks_and_notify()
returns void as $$
begin
  insert into notifications (recipient_id, type)
  select us.user_id, 'streak_risk'
  from user_settings us
  where us.streak_reminder_enabled
    and not exists (
      select 1 from app_opens ao
      where ao.user_id = us.user_id and ao.opened_on = current_date
    )
    and not exists (
      select 1 from notifications n
      where n.recipient_id = us.user_id
        and n.type = 'streak_risk'
        and n.created_at::date = current_date
    );
end;
$$ language plpgsql security definer set search_path = public;

-- Only schedules the job if pg_cron is already enabled (Supabase dashboard ->
-- Database -> Extensions -> pg_cron). Safe to rerun; cron.schedule upserts by
-- job name. If pg_cron isn't enabled yet, this silently does nothing --
-- enable the extension and rerun this block to activate the job. The hour
-- below (19 = 7pm) is UTC; adjust to taste.
do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.schedule('streak-risk-check', '0 19 * * *', 'select check_streaks_and_notify()');
  end if;
end;
$$;
