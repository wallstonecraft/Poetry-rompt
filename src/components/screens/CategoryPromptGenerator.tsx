"use client";

import { useState } from "react";
import { Button } from "@/components/ui/forms/Button";
import { EmptyState } from "@/components/ui/data-display/EmptyState";
import { StartWritingButton } from "@/components/screens/StartWritingButton";
import type { PromptRecord } from "@/lib/queries/prompts";

export function CategoryPromptGenerator({ prompts }: { prompts: PromptRecord[] }) {
  const [current, setCurrent] = useState<PromptRecord | null>(null);

  if (prompts.length === 0) {
    return <EmptyState title="No prompts yet" body="Check back soon." />;
  }

  function generate() {
    // Avoid repeating the same prompt back-to-back.
    const pool = current && prompts.length > 1 ? prompts.filter((p) => p.id !== current.id) : prompts;
    setCurrent(pool[Math.floor(Math.random() * pool.length)]);
  }

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        padding: "24px 16px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          font: "var(--text-prompt)",
          fontStyle: "italic",
          color: "var(--green-700)",
          minHeight: "3.6em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {current?.text}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 280 }}>
        <Button onClick={generate} style={{ width: "100%" }}>
          Generate prompt
        </Button>
        {current && (
          <StartWritingButton promptId={current.id} variant="secondary" style={{ width: "100%" }} />
        )}
      </div>
    </div>
  );
}
