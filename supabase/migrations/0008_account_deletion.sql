-- Account deletion: hard delete, per the Terms of Service's erasure
-- commitment. Every FK back to profiles(id) already cascades (poems,
-- fragments, follows in both directions, appreciations, notifications,
-- user_settings, reports, writing_sessions), so deleting auth.users -- which
-- profiles.id references ON DELETE CASCADE -- brings the whole tree down in
-- one transaction. Two curation-table FKs had no ON DELETE action and would
-- have blocked deletion for anyone ever featured or used as Daily
-- Inspiration; fixed here so deletion can never fail on those.

alter table featured_poets drop constraint featured_poets_poet_id_fkey;
alter table featured_poets add constraint featured_poets_poet_id_fkey
  foreign key (poet_id) references profiles (id) on delete cascade;

alter table featured_poets drop constraint featured_poets_poem_id_fkey;
alter table featured_poets add constraint featured_poets_poem_id_fkey
  foreign key (poem_id) references poems (id) on delete cascade;

alter table daily_inspirations drop constraint daily_inspirations_poem_id_fkey;
alter table daily_inspirations add constraint daily_inspirations_poem_id_fkey
  foreign key (poem_id) references poems (id) on delete cascade;

-- SECURITY DEFINER, owned by postgres (the role migrations run as via the
-- Supabase SQL editor) -- postgres holds the grants needed to delete from
-- auth.users directly, which the authenticated role never does and never
-- should. A single delete here cascades through every table above.
create or replace function delete_my_account()
returns void language plpgsql security definer set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

grant execute on function delete_my_account() to authenticated;
