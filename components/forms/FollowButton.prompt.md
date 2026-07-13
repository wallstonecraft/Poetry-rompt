Pill toggle used on poet profiles and byline rows in the feed. No follower counts are ever shown alongside it — the app never surfaces follower/following numbers anywhere.

```jsx
<FollowButton following={isFollowing} onChange={setIsFollowing} />
```

Hovering a "Following" state previews "Unfollow" in the error tone so unfollowing is deliberate but not alarming.
