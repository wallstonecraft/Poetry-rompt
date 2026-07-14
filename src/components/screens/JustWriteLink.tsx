"use client";

import { useTransition } from "react";
import { createDraft } from "@/lib/actions/poems";
import type { CSSProperties } from "react";

/** A lower-emphasis alternative to "Start writing," not a competing
 * feature — plain text, not a button. Creates a freeform draft (no
 * prompt_id), so the writing screen omits the PROMPT block entirely. */
export function JustWriteLink({ style }: { style?: CSSProperties }) {
  const [pending, startTransition] = useTransition();
  return (
    <span
      onClick={() => {
        if (!pending) startTransition(() => void createDraft());
      }}
      style={{
        font: "var(--text-caption-medium)",
        color: "var(--paper-0)",
        opacity: 0.85,
        cursor: pending ? "default" : "pointer",
        textDecoration: "underline",
        ...style,
      }}
    >
      Just write, no prompt
    </span>
  );
}
