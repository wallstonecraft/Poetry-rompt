import { notFound } from "next/navigation";
import Link from "next/link";
import { getFeaturedPoetById } from "@/lib/queries/home";
import { BackTopAppBar } from "@/components/screens/BackTopAppBar";
import { PoemText } from "@/components/richtext/PoemText";
import { Avatar } from "@/components/ui/data-display/Avatar";

export default async function FeaturedPoetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const feature = await getFeaturedPoetById(id);
  if (!feature) notFound();

  return (
    <div>
      <BackTopAppBar title="" />
      <div style={{ padding: "4px 24px 24px" }}>
        <div
          style={{
            font: "var(--text-caption-medium)",
            color: "var(--green-700)",
            letterSpacing: "var(--tracking-caption)",
            marginBottom: 14,
          }}
        >
          WEEKLY FEATURED POET
        </div>
        <Link href={`/poet/${feature.poet.id}`} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, color: "inherit" }}>
          <Avatar name={feature.poet.name} size={32} src={feature.poet.avatarUrl} />
          <span style={{ font: "var(--text-body-medium)", color: "var(--text-primary)" }}>{feature.poet.name}</span>
        </Link>
        <div style={{ font: "var(--text-headline)", marginBottom: 6 }}>{feature.poem.title}</div>
        <PoemText content={feature.poem.content} style={{ font: "var(--text-poem)", color: "var(--ink-1)", marginBottom: 28 }} />
        <div style={{ font: "var(--text-label)", letterSpacing: "var(--tracking-label)", color: "var(--text-secondary)", marginBottom: 14 }}>
          IN CONVERSATION
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {feature.conversation.map((qa, i) => (
            <div key={i}>
              <div style={{ font: "var(--text-body-medium)", color: "var(--text-primary)", marginBottom: 4 }}>{qa.q}</div>
              <div style={{ font: "var(--text-body)", color: "var(--text-secondary)" }}>{qa.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
