"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/data-display/Card";
import { Badge } from "@/components/ui/feedback/Badge";
import { Input } from "@/components/ui/forms/Input";
import { Button } from "@/components/ui/forms/Button";
import { formatRelativeOrDate } from "@/lib/format";
import { dismissReport, removeReportedPoem, suspendReportedAccount, warnReportedAccount } from "@/lib/actions/admin";
import type { ReportRecord } from "@/lib/queries/admin";

const STATUS_TONE = { open: "warning", actioned: "brand", dismissed: "neutral" } as const;

/** Bare-bones by design — internal-only, one moderator, no filters or
 * pagination. Each action resolves the report atomically on the server
 * (see admin_*_report RPCs), so this just calls one action and lets
 * revalidatePath refresh the list. */
export function AdminReportCard({ report }: { report: ReportRecord }) {
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();
  const open = report.status === "open";

  function act(fn: (id: string, text: string) => Promise<void>) {
    startTransition(() => void fn(report.id, note));
  }

  return (
    <Card style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <Badge tone={STATUS_TONE[report.status]}>{report.status}</Badge>
        <span style={{ font: "var(--text-caption)", color: "var(--text-placeholder)" }}>
          {formatRelativeOrDate(report.createdAt)}
        </span>
      </div>

      <div style={{ font: "var(--text-caption)", color: "var(--text-secondary)", marginBottom: 6 }}>
        Reported by {report.reporter?.name ?? "(deleted account)"} — {report.reason}
      </div>

      {report.poem && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ font: "var(--text-body-medium)", color: "var(--text-primary)" }}>
            &ldquo;{report.poem.title}&rdquo; by {report.poem.author?.name ?? "(deleted account)"}
          </div>
          <div style={{ font: "var(--text-body)", color: "var(--text-secondary)", whiteSpace: "pre-line" }}>
            {report.poem.excerpt}
          </div>
        </div>
      )}

      {report.reportedPoet && !report.poem && (
        <div style={{ font: "var(--text-body-medium)", color: "var(--text-primary)", marginBottom: 10 }}>
          Reported profile: {report.reportedPoet.name}
        </div>
      )}

      {report.outcome && (
        <div style={{ font: "var(--text-caption)", color: "var(--text-secondary)", marginBottom: 10 }}>
          Outcome: {report.outcome}
        </div>
      )}

      {open && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Outcome note (e.g. reason for the action taken)…"
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {report.poem && (
              <Button size="sm" variant="destructive" disabled={pending} onClick={() => act(removeReportedPoem)}>
                Remove poem
              </Button>
            )}
            <Button size="sm" variant="destructive" disabled={pending} onClick={() => act(suspendReportedAccount)}>
              Suspend account
            </Button>
            <Button size="sm" variant="secondary" disabled={pending} onClick={() => act(warnReportedAccount)}>
              Warn account
            </Button>
            <Button size="sm" variant="ghost" disabled={pending} onClick={() => act(dismissReport)}>
              Dismiss
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
