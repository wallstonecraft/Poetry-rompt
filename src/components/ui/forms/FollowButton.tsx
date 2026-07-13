"use client";

import { useState, type CSSProperties } from "react";

export function FollowButton({
  following = false,
  onChange,
  size = "sm",
  style,
}: {
  following?: boolean;
  onChange?: (next: boolean) => void;
  size?: "sm" | "md";
  style?: CSSProperties;
}) {
  const [hover, setHover] = useState(false);
  const pad = size === "sm" ? "6px 14px" : "10px 20px";
  const font = size === "sm" ? "600 13px var(--font-sans)" : "var(--text-button)";
  let bg: string, color: string, border: string;
  if (following) {
    bg = hover ? "var(--state-error-subtle)" : "transparent";
    color = hover ? "var(--state-error)" : "var(--text-secondary)";
    border = `1px solid ${hover ? "var(--state-error)" : "var(--border-hairline)"}`;
  } else {
    bg = hover ? "var(--brand-primary-hover)" : "var(--brand-primary)";
    color = "var(--text-on-brand)";
    border = "1px solid transparent";
  }
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onChange?.(!following);
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: pad,
        borderRadius: "var(--radius-full)",
        font,
        background: bg,
        color,
        border,
        cursor: "pointer",
        transition: "all var(--duration-fast) var(--ease-standard)",
        minWidth: 92,
        ...style,
      }}
    >
      {following ? (hover ? "Unfollow" : "Following") : "Follow"}
    </button>
  );
}
