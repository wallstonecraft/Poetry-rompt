Multi-line field. Set `poemStyle` when it IS the poem-writing canvas (renders in italic Newsreader serif at reading size).

```jsx
<TextArea poemStyle rows={10} placeholder="Begin here..." value={draft} onChange={e => setDraft(e.target.value)} />
```
