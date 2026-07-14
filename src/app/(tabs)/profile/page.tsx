import Link from "next/link";
import { Settings } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getProfile } from "@/lib/queries/profile";
import { getMyPoems } from "@/lib/queries/poems";
import { getActiveFragmentsCount } from "@/lib/queries/fragments";
import { formatRelativeOrDate } from "@/lib/format";
import { TopAppBar } from "@/components/ui/navigation/TopAppBar";
import { Avatar } from "@/components/ui/data-display/Avatar";
import { MyProfileTabs } from "@/components/screens/MyProfileTabs";
import { BioEditor } from "@/components/screens/BioEditor";

export default async function MyProfilePage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const user = await requireUser();
  const [profile, published, drafts, fragmentsCount] = await Promise.all([
    getProfile(user.id),
    getMyPoems(user.id, "published"),
    getMyPoems(user.id, "draft"),
    getActiveFragmentsCount(user.id),
  ]);

  return (
    <div style={{ padding: "16px 16px 24px" }}>
      <TopAppBar
        title="Profile"
        style={{ padding: "0 0 14px", borderBottom: "none" }}
        right={
          <Link href="/settings" aria-label="Settings" style={{ color: "var(--ink-1)", display: "inline-flex" }}>
            <Settings size={20} strokeWidth={1.8} />
          </Link>
        }
      />
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
        <Avatar name={profile?.name ?? ""} size={56} src={profile?.avatarUrl} />
        <div style={{ minWidth: 0 }}>
          <div style={{ font: "var(--text-headline)", color: "var(--text-primary)", marginBottom: 2 }}>{profile?.name}</div>
          <BioEditor initialBio={profile?.bio ?? null} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        <Link href="/about-you" style={{ font: "var(--text-caption-medium)", color: "var(--green-700)" }}>
          Your stats
        </Link>
        <Link href="/fragments" style={{ font: "var(--text-caption-medium)", color: "var(--green-700)" }}>
          Fragments ({fragmentsCount})
        </Link>
      </div>
      <MyProfileTabs
        initialTab={tab === "draft" ? "draft" : "published"}
        published={published.map((p) => ({
          id: p.id,
          title: p.title,
          content: p.content,
          tags: p.tags,
          date: formatRelativeOrDate(p.publishedAt),
          status: p.status,
          competitionTitle: p.competitionTitle,
        }))}
        drafts={drafts.map((p) => ({
          id: p.id,
          title: p.title,
          content: p.content,
          tags: p.tags,
          date: formatRelativeOrDate(p.updatedAt),
          status: p.status,
          competitionTitle: p.competitionTitle,
        }))}
      />
    </div>
  );
}
