import Link from "next/link";
import { Bell } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getFeed, getFollowingFeed, getDiscoverFeed } from "@/lib/queries/poems";
import { getLikedPoemIds } from "@/lib/queries/social";
import { hasUnreadNotifications } from "@/lib/queries/notifications";
import { formatRelativeOrDate } from "@/lib/format";
import { TopAppBar } from "@/components/ui/navigation/TopAppBar";
import { PoemCardWithLike } from "@/components/screens/PoemCardWithLike";
import { FeedEnteredOverlay } from "@/components/screens/FeedEnteredOverlay";
import { FeedTabs, type FeedView } from "@/components/screens/FeedTabs";
import { EmptyState } from "@/components/ui/data-display/EmptyState";

const CAPTIONS: Record<FeedView, string> = {
  all: "Chronological: poets you follow, plus recent public poems.",
  following: "Poems from poets you follow.",
  discover: "Poems from poets you don't follow yet.",
};

const EMPTY_STATES: Record<FeedView, { title: string; body: string }> = {
  all: { title: "Nothing here yet", body: "Published poems will show up here." },
  following: { title: "No poems yet", body: "Follow poets to see their poems here." },
  discover: { title: "Nothing new to discover yet", body: "Check back soon for poems from poets you don't follow yet." },
};

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ entered?: string; view?: string }>;
}) {
  const { entered, view } = await searchParams;
  const activeView: FeedView = view === "following" || view === "discover" ? view : "all";
  const user = await requireUser();

  const poems = await (activeView === "following"
    ? getFollowingFeed(user.id)
    : activeView === "discover"
      ? getDiscoverFeed(user.id)
      : getFeed());

  const [likedIds, unread] = await Promise.all([
    getLikedPoemIds(user.id, poems.map((p) => p.id)),
    hasUnreadNotifications(user.id),
  ]);

  return (
    <div style={{ padding: "16px 16px 24px" }}>
      {entered && <FeedEnteredOverlay competitionTitle={decodeURIComponent(entered)} />}
      <TopAppBar
        title="Feed"
        style={{ padding: "0 0 14px", borderBottom: "none" }}
        right={
          <Link href="/notifications" style={{ position: "relative", display: "inline-flex", color: "var(--ink-1)" }} aria-label="Notifications">
            <Bell size={18} strokeWidth={1.8} />
            {unread && (
              <span
                style={{
                  position: "absolute",
                  top: -2,
                  right: -2,
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "var(--heather-500)",
                }}
              />
            )}
          </Link>
        }
      />
      <FeedTabs value={activeView} />
      <div style={{ font: "var(--text-caption)", color: "var(--text-placeholder)", marginBottom: 14 }}>{CAPTIONS[activeView]}</div>
      {poems.length === 0 ? (
        <EmptyState title={EMPTY_STATES[activeView].title} body={EMPTY_STATES[activeView].body} />
      ) : (
        poems.map((p) => (
          <PoemCardWithLike
            key={p.id}
            initialLiked={likedIds.has(p.id)}
            poem={{
              id: p.id,
              title: p.title,
              content: p.content,
              tags: p.tags,
              date: formatRelativeOrDate(p.publishedAt),
              author: p.author,
            }}
          />
        ))
      )}
    </div>
  );
}
