"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

/** Gentle fade + scale only, matching the app's motion guidelines (no
 * bounce, no confetti) — a quiet confirmation, not a celebration banner. */
export function CompetitionEnteredOverlay({ competitionTitle, onDone }: { competitionTitle: string; onDone: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 10);
    const hideTimer = setTimeout(() => setVisible(false), 1800);
    const doneTimer = setTimeout(onDone, 2100);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          background: "var(--paper-0)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-lg)",
          padding: "32px 40px",
          maxWidth: 280,
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.96)",
          transition: "opacity var(--duration-slow) var(--ease-standard), transform var(--duration-slow) var(--ease-standard)",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "var(--brand-subtle)",
            color: "var(--green-700)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Check size={24} strokeWidth={2} />
        </div>
        <div style={{ font: "var(--text-headline)", color: "var(--text-primary)", textAlign: "center" }}>Competition entered</div>
        <div style={{ font: "var(--text-caption)", color: "var(--text-secondary)", textAlign: "center" }}>{competitionTitle}</div>
      </div>
    </div>
  );
}
