import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getTodaysPrompt, getCategories } from "@/lib/queries/prompts";
import { getWeeklyFeature, getDailyInspiration } from "@/lib/queries/home";
import { getRevisitItem } from "@/lib/queries/revisit";
import { getCompetitions } from "@/lib/queries/competitions";
import { logAppOpen } from "@/lib/actions/activity";
import { formatDeadline, formatRelativeOrDate } from "@/lib/format";
import { poemContentToPlainText } from "@/lib/richtext";
import { TopAppBar } from "@/components/ui/navigation/TopAppBar";
import { Card } from "@/components/ui/data-display/Card";
import { Avatar } from "@/components/ui/data-display/Avatar";
import { Badge } from "@/components/ui/feedback/Badge";
import { StartWritingButton } from "@/components/screens/StartWritingButton";
import { JustWriteLink } from "@/components/screens/JustWriteLink";

export default async function HomePage() {
  const user = await requireUser();
  // The (tabs) layout also calls this, but Next.js renders a layout and its
  // page concurrently rather than strictly sequentially, so calling it again
  // here guarantees today's app_opens row exists before anything on this
  // page (or a page navigated to from here) reads it.
  await logAppOpen();
  const [prompt, weeklyFeature, dailyInspiration, revisitItem, categories, competitions] = await Promise.all([
    getTodaysPrompt(),
    getWeeklyFeature(),
    getDailyInspiration(),
    getRevisitItem(user.id),
    getCategories(),
    getCompetitions(),
  ]);

  return (
    <div style={{ padding: "16px 16px 24px" }}>
      <TopAppBar title="Poetry Prompt" style={{ padding: "0 0 14px", borderBottom: "none" }} />

      <Card style={{ background: "var(--green-700)", marginBottom: 20 }}>
        <div style={{ font: "var(--text-caption)", color: "var(--green-100)", marginBottom: 8, letterSpacing: "var(--tracking-caption)" }}>
          TODAY&apos;S PROMPT
        </div>
        <div style={{ font: "var(--text-prompt)", fontStyle: "italic", color: "var(--paper-0)", marginBottom: 16 }}>
          {prompt?.text ?? "Describe a color you've never named."}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <StartWritingButton
            promptId={prompt?.id}
            variant="secondary"
            style={{ background: "var(--paper-0)", color: "var(--green-700)" }}
          />
          <JustWriteLink />
        </div>
      </Card>

      {revisitItem && (
        <Link
          href={revisitItem.type === "draft" ? `/write/${revisitItem.id}` : "/fragments"}
          style={{ display: "block", color: "inherit" }}
        >
          <Card interactive style={{ marginBottom: 20 }}>
            <div style={{ font: "var(--text-caption-medium)", color: "var(--heather-600)", letterSpacing: "var(--tracking-caption)", marginBottom: 12 }}>
              FROM YOUR NOTEBOOK
            </div>
            <div style={{ font: "var(--text-poem)", color: "var(--ink-1)", whiteSpace: "pre-line", marginBottom: 10 }}>
              {revisitItem.text}
            </div>
            <div style={{ font: "var(--text-caption)", color: "var(--text-placeholder)" }}>
              {revisitItem.type === "fragment" ? "A fragment from" : "A draft from"} {formatRelativeOrDate(revisitItem.date)}
            </div>
          </Card>
        </Link>
      )}

      {dailyInspiration && (
        <Link href={`/poem/${dailyInspiration.poem.id}`} style={{ display: "block", color: "inherit" }}>
          <Card interactive style={{ marginBottom: 20 }}>
            <div style={{ font: "var(--text-caption-medium)", color: "var(--heather-600)", letterSpacing: "var(--tracking-caption)", marginBottom: 12 }}>
              DAILY INSPIRATION
            </div>
            <div style={{ font: "var(--text-poem)", color: "var(--ink-1)", whiteSpace: "pre-line", marginBottom: 10 }}>
              {poemContentToPlainText(dailyInspiration.poem.content)}
            </div>
            <div style={{ font: "var(--text-caption)", color: "var(--text-placeholder)" }}>{dailyInspiration.poem.byline}</div>
          </Card>
        </Link>
      )}

      {weeklyFeature && (
        <Link href={`/featured/${weeklyFeature.id}`} style={{ display: "block", color: "inherit" }}>
          <Card interactive style={{ marginTop: 20 }}>
            <div style={{ font: "var(--text-caption-medium)", color: "var(--green-700)", letterSpacing: "var(--tracking-caption)", marginBottom: 12 }}>
              WEEKLY FEATURED POET
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Avatar name={weeklyFeature.poet.name} size={28} src={weeklyFeature.poet.avatarUrl} />
              <span style={{ font: "var(--text-caption-medium)", color: "var(--text-secondary)" }}>{weeklyFeature.poet.name}</span>
            </div>
            <div
              style={{
                font: "var(--text-poem)",
                color: "var(--ink-1)",
                whiteSpace: "pre-line",
                marginBottom: 10,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {poemContentToPlainText(weeklyFeature.poem.content)}
            </div>
            <div style={{ font: "var(--text-caption-medium)", color: "var(--green-700)" }}>Read the poem and the conversation</div>
          </Card>
        </Link>
      )}

      <Link
        href="/explore"
        style={{
          display: "block",
          textAlign: "center",
          marginTop: 20,
          font: "var(--text-caption-medium)",
          color: "var(--green-700)",
        }}
      >
        Explore more prompts
      </Link>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/category/${c.slug}`}
            style={{
              flex: "1 1 28%",
              minWidth: 96,
              background: "var(--surface-card)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-sm)",
              padding: "14px 10px",
              textAlign: "center",
              color: "inherit",
            }}
          >
            <div style={{ font: "var(--text-body-medium)", color: "var(--text-primary)" }}>{c.label}</div>
          </Link>
        ))}
      </div>

      <div style={{ font: "var(--text-label)", letterSpacing: "var(--tracking-label)", color: "var(--text-secondary)", margin: "32px 0 10px" }}>
        POETRY COMPETITIONS
      </div>
      {competitions.map((c) => (
        <Link key={c.id} href={`/competition/${c.id}`} style={{ display: "block", color: "inherit" }}>
          <Card interactive style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ font: "var(--text-title)", color: "var(--text-primary)" }}>{c.title}</div>
              <Badge tone="neutral">{formatDeadline(c.closesAt)}</Badge>
            </div>
            <div style={{ font: "var(--text-body)", color: "var(--text-secondary)" }}>{c.theme}</div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
