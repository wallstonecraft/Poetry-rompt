Centered modal — confirmations (delete poem), simple prompts.

```jsx
<Dialog open={confirmOpen} title="Delete this poem?" onClose={close}
  actions={<><Button variant="ghost" onClick={close}>Cancel</Button><Button variant="destructive" onClick={del}>Delete</Button></>}>
  This can't be undone.
</Dialog>
```
