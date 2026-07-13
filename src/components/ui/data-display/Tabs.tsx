import type { CSSProperties } from "react";

export function Tabs({
  tabs = [],
  value,
  onChange,
  style,
}: {
  tabs: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  style?: CSSProperties;
}) {
  return (
    <div style={{ display: "flex", gap: 4, background: "var(--paper-1)", padding: 4, borderRadius: "var(--radius-md)", ...style }}>
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            style={{
              flex: 1,
              padding: "8px 14px",
              border: "none",
              borderRadius: "var(--radius-sm)",
              background: active ? "var(--paper-0)" : "transparent",
              color: active ? "var(--text-primary)" : "var(--text-secondary)",
              font: active ? "600 14px var(--font-sans)" : "500 14px var(--font-sans)",
              boxShadow: active ? "var(--shadow-xs)" : "none",
              cursor: "pointer",
              transition: "all var(--duration-fast) var(--ease-standard)",
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
