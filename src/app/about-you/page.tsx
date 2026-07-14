import { requireUser } from "@/lib/auth";
import { getStreak, getPoemsWrittenCount, getPoemsReadCount } from "@/lib/queries/home";
import { getFragmentsCapturedTotal } from "@/lib/queries/fragments";
import { getWordsWritten } from "@/lib/queries/poems";
import { getWritingSecondsTotal } from "@/lib/queries/writingSessions";
import { formatDuration } from "@/lib/format";
import { BackTopAppBar } from "@/components/screens/BackTopAppBar";
import { Card } from "@/components/ui/data-display/Card";

/** Private, read-only practice record — never visible to anyone but the
 * account owner, not even as an aggregate on the public poet profile. */
export default async function AboutYouPage() {
  const user = await requireUser();
  const [streak, written, read, fragmentsCaptured, wordsWritten, writingSeconds] = await Promise.all([
    getStreak(user.id),
    getPoemsWrittenCount(user.id),
    getPoemsReadCount(user.id),
    getFragmentsCapturedTotal(user.id),
    getWordsWritten(user.id),
    getWritingSecondsTotal(user.id),
  ]);

  const rows = [
    { label: "Day streak", value: streak },
    { label: "Poems written", value: written },
    { label: "Poems read", value: read },
    { label: "Fragments captured", value: fragmentsCaptured },
    { label: "Words written", value: wordsWritten },
    { label: "Time spent writing", value: formatDuration(writingSeconds) },
  ];

  return (
    <div style={{ padding: "16px 16px 24px" }}>
      <BackTopAppBar title="About you" style={{ padding: "0 0 14px" }} />
      <Card padding={0}>
        {rows.map((row, i) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 20px",
              borderTop: i ? "1px solid var(--border-hairline)" : "none",
            }}
          >
            <div style={{ font: "var(--text-body)", color: "var(--text-primary)" }}>{row.label}</div>
            <div style={{ font: "var(--text-headline)", color: "var(--green-700)" }}>{row.value}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}
