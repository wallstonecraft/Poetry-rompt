"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";

type Variant = "primary" | "secondary" | "ghost";

function variantStyle(variant: Variant) {
  switch (variant) {
    case "secondary":
      return { background: "var(--brand-subtle)", color: "var(--green-700)", border: "1px solid var(--brand-subtle-border)" };
    case "ghost":
      return { background: "transparent", color: "var(--green-700)", border: "1px solid transparent" };
    case "primary":
    default:
      return { background: "var(--brand-primary)", color: "var(--text-on-brand)", border: "1px solid transparent" };
  }
}

/** Button-styled internal navigation link — Server Components can pass an
 * href with no client-only closure required, unlike Button's onClick. */
export function LinkButton({
  href,
  children,
  variant = "primary",
  size = "md",
  style,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: "md" | "sm";
  style?: CSSProperties;
}) {
  const [hover, setHover] = useState(false);
  const sz =
    size === "sm"
      ? { padding: "7px 14px", font: "600 13px/1 var(--font-sans)", radius: "var(--radius-sm)" }
      : { padding: "10px 20px", font: "var(--text-button)", radius: "var(--radius-md)" };
  const v = variantStyle(variant);
  let bg = v.background;
  if (hover && variant === "primary") bg = "var(--brand-primary-hover)";
  if (hover && variant === "secondary") bg = "var(--brand-subtle-border)";
  if (hover && variant === "ghost") bg = "var(--paper-1)";

  return (
    <Link
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        font: sz.font,
        padding: sz.padding,
        borderRadius: sz.radius,
        cursor: "pointer",
        transition: "background var(--duration-fast) var(--ease-standard)",
        ...v,
        background: bg,
        ...style,
      }}
    >
      {children}
    </Link>
  );
}
