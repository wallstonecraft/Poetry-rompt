Primary interactive control for actions — use `primary` once per screen for the main action, `secondary`/`ghost` for the rest.

```jsx
<Button variant="primary" onClick={savePoem}>Save poem</Button>
<Button variant="secondary" size="sm">Add tag</Button>
<Button variant="destructive">Delete draft</Button>
```

Variants: `primary` (solid sage), `secondary` (subtle green tint), `ghost` (text-only), `destructive` (terracotta). Sizes: `md` (default), `sm` (compact, inline actions).
