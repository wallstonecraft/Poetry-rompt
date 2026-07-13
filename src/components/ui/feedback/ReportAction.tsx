"use client";

import { useState, type CSSProperties } from "react";
import { MoreVertical } from "lucide-react";
import type { ReportReason as ReportReasonValue } from "@/lib/supabase/database.types";

export type { ReportReasonValue };

const REASONS: { label: string; value: ReportReasonValue }[] = [
  { label: "Spam", value: "spam" },
  { label: "Harassment or hate", value: "harassment" },
  { label: "Plagiarism", value: "plagiarism" },
  { label: "Something else", value: "other" },
];

/* Quiet, low-emphasis entry point to reporting — lives in an overflow menu,
   never a prominent icon in the primary action row, so the feed doesn't
   feel like it's bracing for conflict. Lives on poem detail + poet profile
   only, never on feed cards. */
export function ReportAction({
  onReport,
  style,
}: {
  onReport: (reason: ReportReasonValue) => void;
  style?: CSSProperties;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative", ...style }}>
      <button
        aria-label="More options"
        onClick={() => setOpen((o) => !o)}
        style={{
          border: "none",
          background: "none",
          cursor: "pointer",
          color: "var(--ink-3)",
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MoreVertical size={18} strokeWidth={1.8} />
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 36,
            background: "var(--paper-0)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-md)",
            border: "1px solid var(--border-hairline)",
            minWidth: 176,
            overflow: "hidden",
            zIndex: 30,
          }}
        >
          {REASONS.map((r) => (
            <div
              key={r.value}
              onClick={() => {
                setOpen(false);
                onReport(r.value);
              }}
              style={{ padding: "10px 14px", font: "var(--text-body)", color: "var(--text-primary)", cursor: "pointer" }}
            >
              {r.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
