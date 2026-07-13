"use client";

import { useTransition } from "react";
import { Card } from "@/components/ui/data-display/Card";
import { createDraft } from "@/lib/actions/poems";

// A plain click handler, not a <Link> — Next.js prefetches Links that sit in
// the DOM, and createDraft() is a mutation (it inserts a poem row), so it
// must only ever fire from an explicit click, never from route prefetching.
export function PromptCard({ promptId, dateLabel, text }: { promptId: string; dateLabel?: string; text: string }) {
  const [, startTransition] = useTransition();
  return (
    <Card interactive onClick={() => startTransition(() => void createDraft(promptId))} style={{ marginBottom: 12 }}>
      {dateLabel && <div style={{ font: "var(--text-caption)", color: "var(--text-placeholder)", marginBottom: 8 }}>{dateLabel}</div>}
      <div style={{ font: "var(--text-prompt)", fontStyle: "italic", color: "var(--green-700)" }}>{text}</div>
    </Card>
  );
}
