import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getProfile } from "@/lib/queries/profile";
import { getPoetPoems } from "@/lib/queries/poems";
import { getLikedPoemIds, isFollowing } from "@/lib/queries/social";
import { formatRelativeOrDate } from "@/lib/format";
import { BackTopAppBar } from "@/components/screens/BackTopAppBar";
import { Avatar } from "@/components/ui/data-display/Avatar";
import { EmptyState } from "@/components/ui/data-display/EmptyState";
import { FollowToggle } from "@/components/screens/FollowToggle";
import { PoemCardWithLike } from "@/components/screens/PoemCardWithLike";

export default async function PoetProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const poet = await getProfile(id);
  if (!poet) notFound();

  const poems = await getPoetPoems(id);
  const [likedIds, following] = await Promise.all([
    getLikedPoemIds(user.id, poems.map((p) => p.id)),
    isFollowing(user.id, id),
  ]);

  return (
    <div>
      <BackTopAppBar title="" />
      <div style={{ padding: "4px 16px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <Avatar name={poet.name} size={56} src={poet.avatarUrl} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: "var(--text-headline)", color: "var(--text-primary)", marginBottom: 2 }}>{poet.name}</div>
            {poet.bio && <div style={{ font: "var(--text-caption)", color: "var(--text-secondary)" }}>{poet.bio}</div>}
          </div>
        </div>
        {user.id !== id && (
          <FollowToggle poetId={id} initialFollowing={following} size="md" style={{ width: "100%", marginBottom: 20 }} />
        )}
        <div style={{ font: "var(--text-label)", letterSpacing: "var(--tracking-label)", color: "var(--text-secondary)", marginBottom: 10 }}>
          POEMS
        </div>
        {poems.length ? (
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
                author: { id: poet.id, name: poet.name, avatarUrl: poet.avatarUrl },
              }}
            />
          ))
        ) : (
          <EmptyState title="No poems yet" />
        )}
      </div>
    </div>
  );
}
