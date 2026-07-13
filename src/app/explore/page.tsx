import { getPastPrompts } from "@/lib/queries/prompts";
import { BackTopAppBar } from "@/components/screens/BackTopAppBar";
import { PromptCard } from "@/components/screens/PromptCard";

export default async function ExplorePage() {
  const prompts = await getPastPrompts();

  return (
    <div>
      <BackTopAppBar title="Explore prompts" />
      <div style={{ padding: "4px 16px 24px" }}>
        <div style={{ font: "var(--text-caption)", color: "var(--text-placeholder)", marginBottom: 14 }}>
          Past daily prompts. Pick one to write from.
        </div>
        {prompts.map((p) => (
          <PromptCard
            key={p.id}
            promptId={p.id}
            text={p.text}
            dateLabel={p.scheduledDate ? new Date(p.scheduledDate).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
