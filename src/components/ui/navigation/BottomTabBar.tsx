import type { CSSProperties, ReactNode } from "react";

export function BottomTabBar({
  items,
  value,
  onChange,
  style,
}: {
  items: { value: string; label: string; icon: ReactNode }[];
  value: string;
  onChange: (value: string) => void;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        background: "var(--bg-app)",
        borderTop: "1px solid var(--border-hairline)",
        padding: "10px 8px calc(10px + env(safe-area-inset-bottom, 0px))",
        ...style,
      }}
    >
      {items.map((it) => {
        const active = it.value === value;
        return (
          <button
            key={it.value}
            onClick={() => onChange(it.value)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              border: "none",
              background: "none",
              cursor: "pointer",
              color: active ? "var(--green-700)" : "var(--ink-3)",
            }}
          >
            {it.icon}
            <span style={{ font: active ? "600 11px var(--font-sans)" : "500 11px var(--font-sans)" }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}
