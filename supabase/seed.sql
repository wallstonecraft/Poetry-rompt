-- Poetry Prompt — sample editorial content.
-- daily_inspirations and featured_poets are intentionally NOT seeded here:
-- both reference a real poem by a real profile, neither of which exist until
-- someone has signed up and published something. Seed those by hand once you
-- have at least one published poem, e.g.:
--
--   insert into daily_inspirations (scheduled_date, poem_id)
--   values (current_date, '<poem-id>');
--
--   insert into featured_poets (week_start, poet_id, poem_id, conversation)
--   values (date_trunc('week', current_date)::date, '<poet-id>', '<poem-id>',
--     '[{"q": "What pulled you toward this poem?", "a": "..."}]');

insert into prompt_categories (slug, label) values
  ('grief', 'Grief'),
  ('love', 'Love'),
  ('family', 'Family'),
  ('nature', 'Nature'),
  ('joy', 'Joy'),
  ('change', 'Change');

-- Today's prompt, plus the previous six days for Explore Prompts.
insert into prompts (text, scheduled_date) values
  ('Describe a color you''ve never named.', current_date),
  ('Write about a door you never opened.', current_date - 1),
  ('What does your street sound like at 3am?', current_date - 2),
  ('A meal that meant more than food.', current_date - 3),
  ('Something you kept longer than you should have.', current_date - 4),
  ('Write to someone you''ve lost touch with.', current_date - 5),
  ('The last ordinary conversation you remember.', current_date - 6);

-- Category prompt banks (no scheduled_date — a freeform pool to pick from).
insert into prompts (text, category_id) values
  ('The last ordinary conversation you remember.', (select id from prompt_categories where slug = 'grief')),
  ('A room that still feels like theirs.', (select id from prompt_categories where slug = 'grief')),
  ('The smallest thing someone has done for you.', (select id from prompt_categories where slug = 'love')),
  ('A love you never said out loud.', (select id from prompt_categories where slug = 'love')),
  ('The shape of a hand you know by heart.', (select id from prompt_categories where slug = 'love')),
  ('A phrase only your family uses.', (select id from prompt_categories where slug = 'family')),
  ('What you inherited that isn''t an object.', (select id from prompt_categories where slug = 'family')),
  ('The chair no one else sits in.', (select id from prompt_categories where slug = 'family')),
  ('The last tree you noticed on purpose.', (select id from prompt_categories where slug = 'nature')),
  ('Weather that matched how you felt.', (select id from prompt_categories where slug = 'nature')),
  ('A season changing its mind.', (select id from prompt_categories where slug = 'nature')),
  ('A moment of joy no one else saw.', (select id from prompt_categories where slug = 'joy')),
  ('The sound of a good day starting.', (select id from prompt_categories where slug = 'joy')),
  ('Write about laughing until it hurt.', (select id from prompt_categories where slug = 'joy')),
  ('The version of you from five years ago.', (select id from prompt_categories where slug = 'change')),
  ('A habit you''re still unlearning.', (select id from prompt_categories where slug = 'change')),
  ('The last big decision you made quietly.', (select id from prompt_categories where slug = 'change'));

insert into competitions (slug, title, theme, prize, closes_at) values
  ('winter-light', 'Winter Light Prize', 'Write about light in an unlikely place.', 'Featured on the home screen for a week', now() + interval '45 days'),
  ('small-things', 'Small Things Contest', 'A poem in under 10 lines about something ordinary.', 'Published in the community anthology', now() + interval '60 days'),
  ('first-lines', 'First Lines Open', 'Write a poem that begins with a question.', 'Read live at the community gathering', now() + interval '75 days');
