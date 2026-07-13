import type { CSSProperties } from "react";

const COLORS = ["var(--green-300)", "var(--green-500)", "var(--heather-300)", "var(--heather-500)", "var(--green-700)"];

function hashColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return COLORS[Math.abs(h) % COLORS.length];
}

export function Avatar({
  name = "",
  size = 40,
  src,
  style,
}: {
  name?: string;
  size?: number;
  src?: string | null;
  style?: CSSProperties;
}) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: src ? `center/cover no-repeat url(${src})` : hashColor(name),
        color: "var(--paper-0)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        font: `500 ${Math.round(size * 0.4)}px var(--font-sans)`,
        flexShrink: 0,
        ...style,
      }}
    >
      {!src && initials}
    </div>
  );
}
