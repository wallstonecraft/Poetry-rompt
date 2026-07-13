# Poetry Prompt — Design System

Poetry Prompt is an online poetry app with two halves: a daily prompt and
private writing practice, and a public feed where poets share finished work.
Prompts arrive daily, drafts stay private until deliberately published, and
finished poems can also be sent to places people already keep things — Notion,
Google Docs, email (**designed but out of scope for the first build** — see
`DESIGN.md` — each is its own OAuth integration, not a quick add). It's a
quiet, literary app — closer to a moleskine passed around a small community
than a social-media timeline.

**Built from scratch.** No existing brand, codebase, or Figma file was
provided — this system was designed fresh from the brief ("Poetry Prompt,"
mobile app, minimal/clean, soft Dorset greens) gathered via the intake
questionnaire. There is no source of truth to defer to; if you're bringing in
real brand material later (logo, a Figma file, an existing codebase), replace
the tokens/assets here rather than treating this as fixed.

## Index

- `styles.css` — root stylesheet; imports every token file below.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css` (+ radius/shadow/motion), `fonts.css`.
- `components/` — reusable UI primitives, grouped by concern:
  - `forms/` — Button, IconButton, Input, TextArea, Select, Checkbox, Radio, Switch, FollowButton
  - `feedback/` — Badge, Tag, Toast, Tooltip, ProgressBar, ReportAction
  - `data-display/` — Card, Avatar, Tabs, PoemCard, EmptyState
  - `overlay/` — Dialog
  - `navigation/` — TopAppBar, BottomTabBar, FAB
- `ui_kits/mobile-app/` — `index.html`, an interactive click-through of the
  full Poetry Prompt app in an iOS device frame: Home, Feed, individual poem
  view, poet profile, my profile (Published/Drafts tabs), Write, Publish
  flow, Notifications, Settings, and Sign up/Login.
- `guidelines/` — foundation specimen cards (color, type, spacing, radius, shadow).
- `SKILL.md` — portable skill file for using this system in Claude Code.

## Intentional additions

No component source existed, so the primitive set is the standard inventory
sized to what the app actually needs (no Accordion/Slider/DataTable — the app
has no use for them). `FAB`, `TopAppBar`, and `BottomTabBar` were added
specifically for the mobile-navigation pattern the app relies on. `PoemCard`,
`FollowButton`, `ReportAction`, and `EmptyState` were added when the app grew
a public feed — each maps to a specific social-layer decision below rather
than a generic "social" component set. Liking a poem reuses the same heart
favorite already designed for your own poems, rather than introducing a
separate mechanic.

## Product decisions (social layer)

These are the load-bearing decisions behind the feed — Claude Code should
build to these, not invent alternatives:

- **Private by default.** New poems are always drafts, visible only to their
  author. Publishing is a separate, deliberate action (see Publish flow) —
  never automatic.
- **Feed is chronological**, not algorithmic: poems from poets you follow
  plus recent public poems, in time order. No ranking, no "for you."
- **Liking, not counting.** The same heart used to favorite a poem is the
  one interaction across the whole app — no separate "appreciation" gesture.
  It appears on feed/library/profile cards and the full poem view. **No
  public count is ever shown anywhere** — not on the card, not on the poem,
  not on the profile. Feed and library cards also carry a "Read the full
  poem" link as the explicit way to open a poem (the card itself is tappable
  too — the link exists so the primary action is never ambiguous).
- **No follower/following counts** are displayed anywhere, including on the
  poet's own profile. The `FollowButton` toggles state but the system never
  surfaces the number behind it.
- **Streaks are private and quiet, by design decision.** A streak counts
  days you've *opened* the app (not days you wrote), shown only to you as a
  plain number on Home — never compared, never public, never framed as a
  competition. The only nudge is a single evening reminder notification on
  a day you haven't opened the app yet ("Your streak ends tonight..."),
  using the amber warning tone — not a banner, not a red badge, not a
  repeated ping. It's toggleable independently of the daily-prompt reminder
  in Settings — respect whichever the user sets. Missing a day quietly
  restarts the count; there is no "you lost your streak" moment, no shaming
  copy, no reset animation. This is the one place a loss-aversion mechanic
  exists in the product — keep it exactly this narrow if you extend it.

## Accessibility

Contrast was checked against WCAG 2.1 AA (4.5:1 normal text, 3:1 large
text/UI) using the palette's actual oklch values, not eyeballed. Two tokens
failed the initial pass and were darkened: `--green-500` (56% → 53%
lightness, used as the primary button background under paper-0 text) and
`--ink-3` (60% → 52% lightness, placeholder/disabled text on paper-0).
Everything else in the palette already cleared AA. See the contrast-check
comment block at the bottom of `tokens/colors.css` for the numbers, and
re-run the check if any base lightness value changes.
- **No comments** in this version — liking is the only response mechanic.
  Revisit only if a later phase decides the moderation cost is worth it.
- **Formatting is sacred.** A poem's line breaks and stanza spacing are
  preserved exactly as written, everywhere the poem appears — including in
  clamped excerpts (`white-space: pre-line`, never re-flowed or
  auto-wrapped away). The writing editor supports **bold and italic** as
  the poet's own inline choice (underline was considered and cut — see
  `DESIGN.md` → "Rich text content" for the full spec: storage format,
  reasoning, and exactly where marks render vs. get stripped to plain
  text). This doesn't reopen the earlier italic decision: the app never
  forces italic on a poem, the poet applies it themselves.
- **Title + publish from the writing screen.** A poem gets its title in
  the same screen it's written in, and the writing screen carries its own
  Publish action — a poet doesn't have to save a draft and go find it in
  Library/Profile just to publish it. Publishing from either place opens
  the same confirmation screen.
- **Reporting is quiet.** `ReportAction` lives in an overflow (kebab) menu on
  the poem detail screen and poet profile — never a prominent icon, and
  never on feed cards, so the feed itself doesn't feel like it's bracing for
  conflict.

## Content fundamentals

- **Voice:** quiet, second-person, unhurried. Prompts and empty states speak
  *to* the writer ("Describe a color you've never named") rather than
  narrating the product ("Users can write about colors").
- **Casing:** sentence case everywhere — titles, buttons, prompts. No
  ALL-CAPS except tiny section eyebrows (e.g. "TODAY'S PROMPT"), which use
  small size + letter-spacing rather than urgency.
- **Length:** short. A prompt is one sentence. Empty states are one line, no
  onboarding-style paragraphs.
- **No exclamation points, no emoji.** The tone is contemplative, not
  cheerleading — this is closer to a moleskine than a habit-tracker.
- **Numbers used sparingly and only when they mean something to the writer**
  (a streak, a monthly goal) — never vanity metrics.

## Visual foundations

- **Palette** — "soft Dorset greens": a muted sage/moss family
  (`--green-50`…`--green-900`) is the entire brand identity; there is no
  secondary brand color. A single **heather** accent (same chroma/lightness
  recipe, rotated hue) is reserved for emotional, personal moments —
  favoriting a poem — never for buttons or navigation. Semantic colors
  (amber warning, terracotta error) follow the same chroma/lightness recipe
  so nothing reads as a jarring, saturated "system" color against the calm
  palette.
- **Backgrounds** — warm, barely-tinted paper neutrals (`--paper-0…3`), never
  pure white or pure black. No gradients, no photography, no texture —
  the paper *is* the texture.
- **Type** — two families only. **Newsreader** (serif) carries anything
  editorial: prompts, poem text, headlines. App-authored copy (the daily
  prompt itself, wherever it's shown) is set in italic as an editorial
  voice choice. A poet's own poem text is set in **roman by default** —
  forcing every poem into italics would be an editorial decision made on
  the poet's behalf, and breaks any poem that uses italics for internal
  emphasis. If italic display ever becomes an option, it should be the
  poet's choice per-poem, not a forced style. **Work Sans** (sans) carries
  all UI chrome: nav titles, buttons, labels, captions.
- **Corners** — soft and consistent: 8px small controls, 12px inputs/buttons,
  20px cards, 28px sheets/dialogs, full-pill chips and toggles. Nothing sharp.
- **Shadows** — very soft and green-tinted (not neutral black) — `--shadow-xs`
  through `--shadow-lg`. Even the largest shadow (dialogs) stays low-contrast;
  this app should never look like it's "popping."
- **Motion** — gentle only: 120–320ms, standard ease-out curve, no bounce, no
  spring overshoot. Interactive cards lift 2px and gain a slightly larger
  shadow on hover; nothing scales dramatically except button-press (0.97).
- **Hover / press states** — hover = subtle tint shift toward a slightly
  darker/lighter tone of the same color (never a different hue); press =
  scale to 0.97 + the darkest tone in that color's ramp (`--green-700`).
- **Borders** — one hairline color (`--border-hairline`) used sparingly:
  input outlines, list dividers, top-app-bar underline. Cards use shadow, not
  border, for separation.
- **Transparency/blur** — reserved for the Dialog scrim (35% dark green-black
  overlay). No frosted-glass chrome elsewhere — the iOS device frame's own
  status bar is the only "glass" surface, and it belongs to the OS chrome,
  not the product.
- **No dark mode in this build.** Every screen assumes the light paper
  palette. Do not add a `prefers-color-scheme` media query, a theme
  toggle, or any partial dark-mode styling — a half-implemented dark mode
  (some screens themed, some not) is worse than none. If dark mode is
  wanted later, design it as its own pass across every screen and token.
- **Layout** — single-column, generous vertical rhythm (16–24px section
  padding), bottom tab bar (Home, Feed, Profile) + FAB for primary
  navigation, pushed full-screen views (not sheets) for writing, poem detail,
  poet profiles, and publishing. Drafts and published poems both live under
  Profile (Published/Drafts tabs) rather than a separate Library tab.

## Iconography

**Icon set: `lucide-react` — settled, see `DESIGN.md` for the full mapping.**
Icons in the UI kit are inline stroke SVGs (1.8px stroke, rounded caps/joins,
20–24px box) that already match Lucide's geometry — they're stand-ins for
the real package, not a custom icon system. Swap them for `lucide-react`
imports at build time. No emoji are used anywhere in the product.

## No logo provided

Poetry Prompt has no logo yet. Everywhere a mark would go, the wordmark is
set in plain Work Sans (600 weight) — see the `TopAppBar` in the Home screen.
This is the settled choice for the first build, not a gap — see `DESIGN.md`
for the full icon/logo/stack lock-in. Do not invent a logo; ask the user for
one when it's ready.
