"use client";

import { X } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

export function Tag({
  children,
  selected = false,
  onClick,
  onRemove,
  style,
}: {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  style?: CSSProperties;
}) {
  return (
    <span
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        font: "var(--text-caption-medium)",
        padding: "6px 12px",
        borderRadius: "var(--radius-full)",
        background: selected ? "var(--brand-primary)" : "var(--paper-1)",
        color: selected ? "var(--text-on-brand)" : "var(--text-secondary)",
        border: `1px solid ${selected ? "transparent" : "var(--border-hairline)"}`,
        cursor: onClick ? "pointer" : "default",
        transition: "all var(--duration-fast) var(--ease-standard)",
        ...style,
      }}
    >
      {children}
      {onRemove && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          style={{ display: "inline-flex", opacity: 0.7 }}
        >
          <X size={10} strokeWidth={1.8} />
        </span>
      )}
    </span>
  );
}
