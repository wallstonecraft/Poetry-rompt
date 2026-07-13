# Poetry Prompt — DESIGN.md

> **Build one = prompts, private writing, publish to feed. No comments, no
> exports, no search, no unpublish, no dark mode.** Read this whole file
> before starting, but if a Claude Code session is ever unsure whether
> something is in scope, this line is the tiebreaker.

Handoff summary for the build phase. This file is the source of truth for
tokens, components, screens, and behaviour — if code and this file disagree,
fix the code (or update this file deliberately, don't just drift).

## What the app is

A daily writing-prompt app with a public feed: private drafts by default,
published poems visible on a chronological feed and the author's profile.
Calm and literary in tone — not a social-media platform. No infinite scroll
pressure, no follower counts, no engagement metrics on display.

**Scope for the first build:** prompts + private writing + publishing to a
public feed. No comments. Follow + appreciation are in scope (they're simple
and already fully designed below); revisit deeper social mechanics only after
real usage.

## Stack recommendation

**Locked in — build against this, don't re-derive it:**

- **Framework:** Next.js.
- **Backend:** Supabase (auth, Postgres, row-level security). Use RLS to
  enforce "drafts are only visible to their author" at the database layer,
  not in application code — this is the mechanism, not just a suggestion.
- **Icons:** [`lucide-react`](https://lucide.dev). The inline placeholder
  SVGs throughout the UI kit already match Lucide's geometry (1.8px stroke,
  same shapes) — they are stand-ins, not a hand-rolled icon system. Swap
  them for the real package import at build time; don't keep hand-rolled
  SVG paths in production code. Per-icon mapping:
  - Home tab → `Home`
  - Feed tab → `Bookmark`
  - Profile tab → `User`
  - Settings gear → `Settings`
  - FAB / new poem → `Plus`
  - Like (heart, filled/unfilled) → `Heart`
  - Export / share → `Share2`
  - Notifications → `Bell`
  - Streak-at-risk notification icon → `Flame`
  - Report overflow menu (kebab) → `MoreVertical`
  - Back button (TopAppBar) → `ChevronLeft`
  - Tag remove (×) → `X`
- **Logo: none for build one.** The Work Sans 600 wordmark is the shipped
  solution until real brand material exists. Do not generate a placeholder
  logo or mark during the build — "no logo exists yet" is a settled
  decision, not an open gap to fill.

## Tokens

Full values live in `tokens/*.css` — import `styles.css` as the single entry
point. Summary:

- **Color** — "soft Dorset greens": muted sage/moss (`--green-50…900`) is the
  entire brand identity, no secondary brand color. A dusty **heather** accent
  (same chroma/lightness recipe, rotated hue) is reserved for emotional,
  personal moments — favoriting, appreciation — never buttons or navigation.
  Semantic amber/terracotta follow the same recipe so nothing reads as a
  jarring "system" color. Warm paper neutrals (`--paper-0…3`), never pure
  white/black. See `tokens/colors.css`.
- **Type** — two families only. **Newsreader** (serif, italic for
  app-authored prompt copy) carries prompts, poem text, headlines. A poet's
  own poem text renders in **roman by default**, not italic — forcing
  italics on every poem is an editorial call that isn't ours to make, and
  breaks poems that use italics for their own internal emphasis. **Work
  Sans** (sans) carries all UI chrome. See `tokens/typography.css` for the
  full scale, including `--text-poem` (line-height 1.6, built for verse).
- **Spacing / radius / shadow / motion** — see `tokens/spacing.css` and the
  specimen pages in `guidelines/`. Corners: 8px small controls, 12px
  inputs/buttons, 20px cards, 28px sheets/dialogs, full-pill chips/toggles.
  Shadows are soft and green-tinted, never neutral black. Motion is gentle
  only (120–320ms, ease-out, no bounce).

## Components

Full source + usage notes in `components/**/*.jsx` and `*.prompt.md`. States
(default/hover/active/disabled) are implemented per component; see each file.

- **Prompt card** (`data-display` pattern used inline as `PromptHero` in the
  UI kit) — today's prompt, dark green surface, one CTA ("Start writing").
- **PoemCard** (`data-display/PoemCard.jsx`) — `feed` variant (byline,
  3-line-clamped excerpt, heart like button, "Read the full poem" link) and
  `full` variant (complete poem, whitespace preserved exactly). Keep follow
  and report off the card — those stay on the full poem/profile screens.
  **The excerpt renders as plain text — bold/italic marks are stripped, but
  line breaks are not** (see "Rich text content" below for the full
  reasoning and the complete list of where formatting does and doesn't
  render).
- **Writing editor** — silent autosave: no Save button. The top bar shows a
  small "Saving..." → "Saved" status instead, and each draft in the
  library/profile list carries a small "Saved {when}" timestamp in place of
  a plain date. Never require an explicit save action to avoid losing a
  draft. The editor supports **bold and italic** via a small toolbar above
  it — the poet's own inline formatting choice (see "Rich text content"
  below for the storage format, why underline was cut, and where the
  formatting is and isn't preserved on read).
- **Publish button + confirmation** — a `Button` on a draft's detail screen
  opens a dedicated `PublishScreen`: shows the full poem as it will appear,
  states plainly that this makes it public and (once seen) not reversible to
  private, requires an explicit second tap to confirm.
- **Like (heart)** — the same favorite/like heart is used everywhere a poem
  can be liked: your own poems, feed cards, library/profile cards, and the
  full poem view. No count is ever rendered next to it.
- **FollowButton** (`forms/FollowButton.jsx`) — pill toggle; hover on
  "Following" previews "Unfollow" in the error tone. No follower/following
  counts anywhere.
- **Avatar + byline** (`data-display/Avatar.jsx`) — initials-on-hashed-color
  by default, real photo when available; byline is Avatar + name composed
  inline (see `PoemCard`/`PoetProfileScreen`).
- **ReportAction** (`feedback/ReportAction.jsx`) — overflow (kebab) menu,
  reasons: Spam, Harassment or hate, Plagiarism, Something else. Lives on
  poem detail + poet profile only, never on feed cards.
- **EmptyState** (`data-display/EmptyState.jsx`) — one-line title (italic
  serif) + optional one-line body + optional action, matching the app's
  terse voice. No onboarding-style paragraphs.
- **Navigation** — mobile-first bottom tab bar: Home, Feed, Profile, plus a
  FAB for "new poem" that's available from any main tab. There is no
  separate Library tab — drafts and published poems both live under Profile.

## Rich text content

Settled spec for the poem editor's formatting — build the schema and
renderer directly from this, don't re-derive it.

**Storage format: structured JSON, not raw HTML.** A poem's content is:

```json
{
  "lines": [
    { "spans": [{ "text": "The kettle sighs before I do", "marks": [] }] },
    { "spans": [
        { "text": "steam finding ", "marks": [] },
        { "text": "the window", "marks": ["italic"] },
        { "text": " first.", "marks": [] }
      ] },
    { "spans": [] }
  ]
}
```

- `lines` is an ordered array — one entry per line as the poet wrote it,
  including empty lines for stanza breaks. This is what makes line breaks
  structural rather than incidental: there's no `\n`-in-a-string to
  accidentally collapse or re-flow, and no whitespace-sensitive parsing.
- Each line is a list of `spans`; each span is `{ text, marks }` where
  `marks` is a subset of `["bold", "italic"]` — nothing else is valid.
- **Why structured JSON over raw HTML:** raw HTML from a contentEditable
  surface is exactly the kind of value that needs sanitizing everywhere it
  renders and is genuinely ambiguous as a backend column (what's the
  source of truth, the HTML string or some parsed form of it?). A closed
  span/marks schema is unambiguous, maps directly to a `jsonb` column, and
  has no injection surface by construction — the renderer only ever maps a
  known mark to a known style, never interprets arbitrary markup.
- **Why not Markdown-style plain text** (`**bold**`, `*italic*`): it
  reintroduces a parsing step and escaping edge cases (a poet who
  literally writes an asterisk), for no benefit over structured JSON.
- The UI kit's click-through uses a `contentEditable` div and stores its
  `innerHTML` as a shortcut for a fast prototype — **that is a prototyping
  convenience, not the spec.** Build the real editor against the
  spans/marks schema above (a minimal custom rich-text control, or a
  lightweight library like Slate configured to only ever emit this shape)
  and convert the editor's internal state to/from it.

**Formatting toolbar: bold and italic only.** Underline was considered and
cut. Reasoning: underline in a manuscript/typewriter tradition is a proof
mark meaning "set this in italics" — it isn't a real typographic device in
set poetry, and Newsreader already gives poets true italics. It also
visually collides with link styling elsewhere in the app (`readme.md`'s `a`
convention is underline-on-hover), which is a confusing overlap in a body
of poem text. Bold + italic is the complete toolbar; don't add underline,
strikethrough, or anything else without a deliberate decision first.

**Where formatting renders, and where it's intentionally stripped:**

- **Preserved (marks + exact line breaks):** the full poem view (poem
  detail screen), the Publish confirmation preview, the Featured Poet
  screen, and the writing/editing surface itself.
- **Line breaks preserved, marks stripped to plain text:** every *excerpt*
  location — feed cards, Home's recent-poems card, library/profile list
  cards, the Weekly Featured Poet card, the Daily Inspiration card. These
  all use a 3-line clamp; bold/italic spans crossing a clamp boundary are
  a real rendering hazard (a span can get cut mid-tag), and a scanning list
  is exactly where the feed's calm, unstyled-text feel matters most —
  formatting becomes a small reward for opening the full poem, not
  competing for attention while scrolling. Stanza/line-break structure is
  still respected in excerpts (`--text-poem` line-height, no re-flow) —
  only inline bold/italic marks are dropped for this view.
- Nowhere else in the app renders a poem's body text (notifications only
  ever show attribution text like "sat with your poem", never poem
  content itself).

**Rendering safety.** Whoever builds this: the spans/marks schema has no
raw-HTML-injection surface by construction, but that only holds if the
renderer stays a closed mapping (`mark === "bold"` → `<strong>`, `mark ===
"italic"` → `<em>`, nothing else) and never falls back to
`dangerouslySetInnerHTML`/`v-html`/equivalent on stored content. Validate
incoming `marks` values server-side too — reject anything outside
`["bold", "italic"]` rather than rendering it.

## Screens (mobile width first)

All built in `ui_kits/mobile-app/index.html`, click-through in an iOS frame:

1. **Sign up / Login** — email + password, toggle link between the two
   modes. No social auth designed; add if the stack decision calls for it.
2. **Home** — today's prompt hero + your own recent published poems.
3. **Feed** — chronological list of `PoemCard` (feed variant) from followed
   poets + recent public poems; a notifications entry point in the top bar
   (plain dot indicator, not a count badge). No search in this build (see
   "Out of scope" below).
4. **Individual poem view** — full poem, preserved formatting. Own
   *published* poem: favorite + export actions. Own *draft*: a Publish
   button in place of those. Someone else's poem: byline + follow context,
   appreciation action, and a report overflow menu.
5. **Poet profile** (someone else's) — avatar, name, one-line bio, follow
   button, their published poems as feed cards. No follower count.
6. **My profile** — avatar, bio, a settings gear instead of a follow button,
   and Published/Drafts tabs holding all of your own poems — so the
   private/public boundary is always visible, never ambiguous. There is no
   separate Library screen; this is the one home for your own work.
7. **Writing view** — prompt shown above a title field and the rich-text
   poem editor (bold/italic/underline toolbar); autosaves silently as a
   private draft. Carries its own **Publish** action in the top bar, so a
   poet can publish straight from here — not only from a saved draft in
   Library/Profile.
8. **Publish flow** — confirmation screen shown before a draft goes public
   (see "Publish button" above).
9. **Notifications** — flat list: who acknowledged a poem, who followed
   you. No counts, no aggregation ("12 people liked...") — always
   attributed to a person. **This needs real backend infrastructure**, not
   just a static list: a `notifications` table plus a trigger on each event
   that populates it (a like, a follow, the streak's evening check). Build
   the trigger alongside the event itself — don't treat notifications as a
   UI-only feature to add later.
10. **Settings** — reminder cadence, streak reminder toggle, connected
    export accounts (Notion/Docs/email — designed but **out of scope for
    build one**, see below), log out.

Desktop layouts were not designed in this pass — the mobile-first shell is
the complete spec; widen the same single-column rhythm with more side margin
rather than introducing new layout patterns for desktop.

## Out of scope for build one

Designed into the UI kit so the visual language is complete, but **do not
build these yet** — flag them back to the user before starting any of them:

- **Export to Notion, Google Docs, and email** (Settings → Connected
  accounts; Poem detail → Export). Each is a separate OAuth integration
  plus its own API surface — three third-party auth flows, not one
  feature. Ship the app with export entirely absent (or a disabled/
  "coming soon" state) rather than wiring even one of these up. Revisit as
  its own phase once the core prompt/publish/feed loop is live.
- **Unpublish.** A published poem cannot be taken back to draft/private in
  this build. Do not add a delete-from-feed or unpublish path — the
  Publish confirmation screen's "can't make it private again" copy is the
  entire spec here. If this becomes a real need later, design it
  deliberately (what happens to existing likes/notifications, etc.)
  rather than bolting on a delete button.
- **Search.** The feed had a search icon in early passes with nothing
  behind it — it's been removed. There is no search screen in this build;
  don't add a bare icon that goes nowhere. Revisit once the feed has
  enough poets/poems that browsing alone isn't sufficient.
- **Dark mode.** Every screen in this system assumes the light paper
  palette only. Do not add a `prefers-color-scheme` query, a theme toggle,
  or partial dark-mode styling on some screens — a half-implemented dark
  mode is worse than none. Treat it as its own future phase if wanted.

## Accessibility

Contrast was checked against WCAG 2.1 AA (4.5:1 normal text, 3:1 large
text/UI) using the palette's real oklch values. Two tokens failed the
initial pass and were darkened: `--green-500` (primary button background,
56% → 53% lightness) and `--ink-3` (placeholder/disabled text, 60% → 52%
lightness). Everything else already cleared AA — see the contrast-check
comment in `tokens/colors.css` for the full numbers. Re-run the check if
any base lightness value in the palette changes.

## Behaviour notes for anything not obvious from the visuals

- **Streaks**: private, opening-based (see readme "Streaks are private and
  quiet"). One evening reminder notification, amber-toned, only on a day
  you haven't opened the app — toggleable in Settings separately from the
  daily-prompt reminder. No public display, no shaming on a missed day.
- A poem is **always** created as a private draft first, even when
  publishing directly from the writing screen — the Publish action there
  takes the same confirmation step as publishing an existing draft, it's
  just reachable in one fewer screen.
- Drafts and published poems live in the same `MY_POEMS`-shaped list,
  distinguished by a `status` field — don't model them as separate tables
  with duplicated fields if you can help it; a status column is enough.
- The feed mixes your own published poems in with everyone else's, sorted by
  time — it is not a separate "your activity" stream.
- Tags are freeform, small, and decorative — filtering by tag was not
  designed as a first-class flow; treat it as a nice-to-have, not a
  required build item.
- No emoji, no exclamation points, sentence case everywhere, prompts and
  empty states speak *to* the writer.

## Icons and logo

**Settled, see the Stack recommendation section at the top for the full
mapping.** Icon set is `lucide-react` — the inline stroke SVGs throughout
the UI kit are placeholders matching Lucide's geometry (1.8px stroke),
already mapped 1:1 to real Lucide component names. No logo exists for
build one; the Work Sans 600 wordmark is the shipped solution. Neither of
these is an open question for Claude Code to resolve mid-build.
