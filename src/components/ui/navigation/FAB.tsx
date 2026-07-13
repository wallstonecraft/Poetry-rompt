"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

export function FAB({ children, onClick, style }: { children: ReactNode; onClick: () => void; style?: CSSProperties }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 56,
        height: 56,
        borderRadius: "50%",
        border: "none",
        background: hover ? "var(--brand-primary-hover)" : "var(--brand-primary)",
        color: "var(--text-on-brand)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "var(--shadow-md)",
        cursor: "pointer",
        transition: "background var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard)",
        transform: hover ? "scale(1.04)" : "scale(1)",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
