-- Poetry Prompt — core schema
-- Draft privacy is enforced at the RLS layer (see 0003_rls.sql), not in application code.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- profiles (one row per auth.users row, created by the handle_new_user trigger)
-- ---------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  bio text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- prompts: the daily-prompt rotation plus the freeform category banks used
-- by Explore Prompts / category browsing. A prompt with scheduled_date set is
-- a day's prompt (exactly one per calendar date); category-only prompts have
-- no scheduled_date and are just a bank to pick from.
-- ---------------------------------------------------------------------------
create table prompt_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null
);

create table prompts (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  category_id uuid references prompt_categories (id),
  scheduled_date date unique,
  created_at timestamptz not null default now()
);

create index prompts_category_idx on prompts (category_id);

-- ---------------------------------------------------------------------------
-- competitions: editorial content, entries are just poems that reference one.
-- ---------------------------------------------------------------------------
create table competitions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  theme text not null,
  prize text not null,
  opens_at timestamptz not null default now(),
  closes_at timestamptz not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- poems: a poem is always created as a private draft first. content is the
-- spans/marks JSON described in DESIGN.md — { lines: [{ spans: [{ text, marks }] }] }.
-- is_editorial rows (e.g. the Daily Inspiration classic poem) have no author
-- and are always published; every other poem must have an author.
-- ---------------------------------------------------------------------------
create table poems (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references profiles (id) on delete cascade,
  is_editorial boolean not null default false,
  editorial_byline text,
  title text not null,
  content jsonb not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  tags text[] not null default '{}',
  prompt_id uuid references prompts (id),
  competition_id uuid references competitions (id),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint poems_editorial_author_chk check (
    (is_editorial and author_id is null) or (not is_editorial and author_id is not null)
  ),
  constraint poems_editorial_always_published_chk check (
    (not is_editorial) or status = 'published'
  ),
  constraint poems_published_at_chk check (
    (status = 'draft' and published_at is null) or (status = 'published' and published_at is not null)
  )
);

create index poems_author_idx on poems (author_id);
create index poems_status_published_idx on poems (status, published_at desc) where status = 'published';

-- ---------------------------------------------------------------------------
-- daily_inspirations / featured_poets: curated editorial slots for Home.
-- ---------------------------------------------------------------------------
create table daily_inspirations (
  id uuid primary key default gen_random_uuid(),
  scheduled_date date not null unique,
  poem_id uuid not null references poems (id),
  created_at timestamptz not null default now()
);

create table featured_poets (
  id uuid primary key default gen_random_uuid(),
  week_start date not null unique,
  poet_id uuid not null references profiles (id),
  poem_id uuid not null references poems (id),
  conversation jsonb not null default '[]',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- follows / appreciations: the two "liking, not counting" mechanics.
-- ---------------------------------------------------------------------------
create table follows (
  follower_id uuid not null references profiles (id) on delete cascade,
  followee_id uuid not null references profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, followee_id),
  constraint follows_no_self_follow_chk check (follower_id <> followee_id)
);

create index follows_followee_idx on follows (followee_id);

create table appreciations (
  id uuid primary key default gen_random_uuid(),
  poem_id uuid not null references poems (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (poem_id, user_id)
);

create index appreciations_poem_idx on appreciations (poem_id);

-- ---------------------------------------------------------------------------
-- app_opens / poem_reads: private-to-the-user activity used for the Home
-- stats card (streak / poems written / poems read) and the streak-risk
-- notification. Never surfaced to anyone but the user themselves.
-- ---------------------------------------------------------------------------
create table app_opens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  opened_on date not null default current_date,
  created_at timestamptz not null default now(),
  unique (user_id, opened_on)
);

create table poem_reads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  poem_id uuid not null references poems (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, poem_id)
);

-- ---------------------------------------------------------------------------
-- notifications: populated by triggers (see 0002), never written by clients.
-- ---------------------------------------------------------------------------
create table notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references profiles (id) on delete cascade,
  type text not null check (type in ('appreciation', 'follow', 'streak_risk')),
  actor_id uuid references profiles (id) on delete cascade,
  poem_id uuid references poems (id) on delete cascade,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_recipient_idx on notifications (recipient_id, created_at desc);

-- ---------------------------------------------------------------------------
-- user_settings: reminder cadence + streak nudge toggle (Settings screen).
-- ---------------------------------------------------------------------------
create table user_settings (
  user_id uuid primary key references profiles (id) on delete cascade,
  prompt_reminder_enabled boolean not null default true,
  prompt_reminder_frequency text not null default 'daily' check (prompt_reminder_frequency in ('daily', 'weekly')),
  streak_reminder_enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- reports: quiet moderation queue, no client read access to others' reports.
-- ---------------------------------------------------------------------------
create table reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references profiles (id) on delete cascade,
  poem_id uuid references poems (id) on delete cascade,
  reported_poet_id uuid references profiles (id) on delete cascade,
  reason text not null check (reason in ('spam', 'harassment', 'plagiarism', 'other')),
  created_at timestamptz not null default now(),
  constraint reports_target_chk check (poem_id is not null or reported_poet_id is not null)
);
