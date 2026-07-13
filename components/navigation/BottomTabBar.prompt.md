Root app navigation — Home, Feed, Profile. Fixed to the screen bottom.

Icons: `lucide-react` — Home tab → `Home`, Feed tab → `Bookmark`, Profile
tab → `User`. See root `DESIGN.md` for the full icon mapping.

```jsx
<BottomTabBar items={[{value:'home',label:'Home',icon:<Home/>}, ...]} value={tab} onChange={setTab} />
```
