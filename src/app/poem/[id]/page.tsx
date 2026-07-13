import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getPoemDetail } from "@/lib/queries/poems";
import { isLiked } from "@/lib/queries/social";
import { logPoemRead } from "@/lib/actions/activity";
import { formatRelativeOrDate } from "@/lib/format";
import { BackTopAppBar } from "@/components/screens/BackTopAppBar";
import { PoemText } from "@/components/richtext/PoemText";
import { Avatar } from "@/components/ui/data-display/Avatar";
import { Tag } from "@/components/ui/feedback/Tag";
import { LinkButton } from "@/components/ui/forms/LinkButton";
import { FavoriteToggle, ReportMenu } from "@/components/screens/PoemDetailActions";
import { PublishNowButton } from "@/components/screens/PublishNowButton";
import Link from "next/link";

export default async function PoemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const poem = await getPoemDetail(id);
  if (!poem) notFound();

  const own = poem.author?.id === user.id;
  // "Poems read" is meant to reflect reading others' work, not your own.
  if (!own) await logPoemRead(id);
  const liked = own && poem.status === "draft" ? false : await isLiked(user.id, id);

  const dateLine = poem.isEditorial
    ? poem.editorialByline
    : poem.status === "draft"
      ? `Saved ${formatRelativeOrDate(poem.updatedAt)}`
      : formatRelativeOrDate(poem.publishedAt);

  return (
    <div>
      <BackTopAppBar
        title=""
        right={
          <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
            {own && poem.status === "draft" && (
              <>
                <LinkButton href={`/write/${id}`} variant="ghost" size="sm">
                  Continue writing
                </LinkButton>
                <PublishNowButton
                  poemId={id}
                  size="sm"
                  redirectTo={poem.competitionTitle ? `/feed?entered=${encodeURIComponent(poem.competitionTitle)}` : "/feed"}
                />
              </>
            )}
            {(!own || poem.status === "published") && <FavoriteToggle poemId={id} initialLiked={liked} />}
            {!own && !poem.isEditorial && poem.author && <ReportMenu poemId={id} />}
          </div>
        }
      />
      <div style={{ padding: "4px 24px 24px" }}>
        {!own && !poem.isEditorial && poem.author && (
          <Link
            href={`/poet/${poem.author.id}`}
            style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, color: "inherit" }}
          >
            <Avatar name={poem.author.name} size={32} src={poem.author.avatarUrl} />
            <span style={{ font: "var(--text-body-medium)", color: "var(--text-primary)" }}>{poem.author.name}</span>
          </Link>
        )}
        <div style={{ font: "var(--text-headline)", marginBottom: 6 }}>{poem.title}</div>
        {dateLine && <div style={{ font: "var(--text-caption)", color: "var(--text-placeholder)", marginBottom: 20 }}>{dateLine}</div>}
        <PoemText content={poem.content} style={{ font: "var(--text-poem)", color: "var(--ink-1)", marginBottom: 20 }} />
        {poem.tags.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {poem.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
