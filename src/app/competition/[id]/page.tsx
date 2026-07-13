import { notFound } from "next/navigation";
import { getCompetition } from "@/lib/queries/competitions";
import { formatDeadline } from "@/lib/format";
import { BackTopAppBar } from "@/components/screens/BackTopAppBar";
import { Badge } from "@/components/ui/feedback/Badge";
import { StartWritingButton } from "@/components/screens/StartWritingButton";

export default async function CompetitionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const competition = await getCompetition(id);
  if (!competition) notFound();

  return (
    <div>
      <BackTopAppBar title="" />
      <div style={{ padding: "4px 24px 24px" }}>
        <Badge tone="neutral" style={{ marginBottom: 14 }}>
          {formatDeadline(competition.closesAt)}
        </Badge>
        <div style={{ font: "var(--text-headline)", marginBottom: 14 }}>{competition.title}</div>
        <div style={{ font: "var(--text-prompt)", fontStyle: "italic", color: "var(--green-700)", marginBottom: 20 }}>
          {competition.theme}
        </div>
        <div style={{ font: "var(--text-label)", letterSpacing: "var(--tracking-label)", color: "var(--text-secondary)", marginBottom: 6 }}>
          IF YOU&apos;RE CHOSEN
        </div>
        <div style={{ font: "var(--text-body)", color: "var(--text-secondary)", marginBottom: 28 }}>{competition.prize}</div>
        <StartWritingButton competitionId={competition.id} label="Write an entry" style={{ width: "100%" }} />
      </div>
    </div>
  );
}
