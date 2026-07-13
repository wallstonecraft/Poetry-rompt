Filter chip / poem theme label. Selectable, optionally removable.

Remove icon: `lucide-react` `X`.

```jsx
<Tag selected={theme==='nature'} onClick={() => setTheme('nature')}>Nature</Tag>
<Tag onRemove={() => removeTag('grief')}>grief</Tag>
```
