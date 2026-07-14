-- Revisit needs to track when a draft was last resurfaced, same as
-- fragments already do (0005). Column-level grants were narrowed in 0004
-- (table-wide UPDATE revoked, re-granted per column), so a new column
-- needs its own explicit grant or it silently stays unwritable.

alter table poems add column last_shown_at timestamptz;

grant select (last_shown_at) on poems to authenticated;
grant update (last_shown_at) on poems to authenticated;
