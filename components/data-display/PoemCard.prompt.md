The core feed unit. `feed` variant clamps to 3 lines, shows byline, a heart like button, and a "Read the full poem" link (both open the same detail screen — the link is the explicit call to action, the card tap is the implicit one). `full` variant is the complete poem, whitespace preserved exactly as written — never re-flow or trim a poet's line breaks.

```jsx
<PoemCard poem={poem} variant="feed" onOpen={openPoemDetail} onOpenPoet={openProfile} liked={isLiked} onLikeChange={setIsLiked} />
<PoemCard poem={poem} variant="full" />
```

The like button is the same heart used for favoriting your own poems — one mechanic across the whole app, no separate "appreciation" gesture. No like count is ever rendered anywhere. Keep follow and report controls off the card itself — those belong on the full poem/profile screens.

Like icon: `lucide-react` `Heart` (filled when liked).

**Formatting in the excerpt:** render as plain text — strip bold/italic marks, but keep line breaks (`white-space: pre-line`/equivalent). A 3-line clamp is a real hazard for inline marks (a span can get cut mid-tag), and the feed's calm, unstyled-text feel matters most in a scanning list — formatting is a small reward for opening the full poem, not something competing for attention while scrolling. The `full` variant renders marks exactly as stored. See root `DESIGN.md` → "Rich text content" for the complete spec (storage format, full list of where formatting is/isn't preserved).
