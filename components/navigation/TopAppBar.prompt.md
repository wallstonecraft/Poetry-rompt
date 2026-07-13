Screen header. Omit `onBack` for top-level tabs (Home, Feed, Profile); include
it on pushed screens (poem detail, write, settings) — its icon is
`lucide-react` `ChevronLeft`.

```jsx
<TopAppBar title="New Poem" onBack={goBack} right={<Button size="sm" onClick={publish}>Publish</Button>} />
```
