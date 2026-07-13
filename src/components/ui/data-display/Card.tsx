"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

export function Card({
  children,
  padding = 20,
  interactive = false,
  onClick,
  style,
}: {
  children: ReactNode;
  padding?: number;
  interactive?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => interactive && setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "var(--surface-card)",
        borderRadius: "var(--radius-lg)",
        padding,
        boxShadow: interactive && hover ? "var(--shadow-md)" : "var(--shadow-sm)",
        transform: interactive && hover ? "translateY(-2px)" : "none",
        transition: "all var(--duration-base) var(--ease-standard)",
        cursor: interactive ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
