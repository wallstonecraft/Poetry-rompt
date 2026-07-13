import { ChevronLeft } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

export function TopAppBar({
  title,
  onBack,
  right,
  style,
}: {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "14px 12px",
        background: "var(--bg-app)",
        borderBottom: "1px solid var(--border-hairline)",
        ...style,
      }}
    >
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Back"
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            color: "var(--ink-1)",
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ChevronLeft size={18} strokeWidth={2} />
        </button>
      )}
      <div style={{ flex: 1, font: "var(--text-title)", color: "var(--text-primary)" }}>{title}</div>
      {right}
    </div>
  );
}
