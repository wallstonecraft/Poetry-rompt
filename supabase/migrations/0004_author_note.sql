-- Private annotations on your own published poems (DESIGN.md "Writing &
-- practice layer" #6). A single nullable column, but it must never be
-- readable through the general poems SELECT that anyone uses to view a
-- published poem — row-level RLS can't redact one column while allowing the
-- rest of the row, so this uses a column-level REVOKE plus two
-- SECURITY DEFINER RPCs that check ownership themselves. Never add
-- author_note to the shared POEM_SELECT string in application code — any
-- query that requests a revoked column fails entirely, by design, as a
-- safety net against accidentally leaking it.

alter table poems add column author_note text;

-- A column-level REVOKE alone does NOT override Supabase's default
-- table-wide GRANT SELECT/UPDATE — a broader table-level grant still wins.
-- The only way to truly wall off one column is to revoke the table-wide
-- grant and re-grant explicitly per column, omitting author_note.
revoke select, update on poems from authenticated;

grant select (
  id, author_id, is_editorial, editorial_byline, title, content, status,
  tags, prompt_id, competition_id, published_at, created_at, updated_at
) on poems to authenticated;

grant update (
  title, content, tags, status, published_at
) on poems to authenticated;

create or replace function get_my_poem_note(p_poem_id uuid)
returns text
language sql
security definer
set search_path = public
as $$
  select author_note from poems where id = p_poem_id and author_id = auth.uid();
$$;

-- Silently no-ops if the poem isn't yours or isn't published yet (notes only
-- ever apply to your own published poems — "finish the poem first").
create or replace function set_my_poem_note(p_poem_id uuid, p_note text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update poems
  set author_note = nullif(p_note, '')
  where id = p_poem_id and author_id = auth.uid() and status = 'published';
end;
$$;

grant execute on function get_my_poem_note(uuid) to authenticated;
grant execute on function set_my_poem_note(uuid, text) to authenticated;
