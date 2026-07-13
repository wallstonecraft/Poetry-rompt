import { X } from "lucide-react";

const TONES: Record<string, string> = {
  success: "var(--green-700)",
  warning: "oklch(45% 0.08 80)",
  error: "var(--state-error)",
  default: "var(--ink-1)",
};

export function Toast({
  message,
  tone = "default",
  visible = true,
  onDismiss,
}: {
  message: string;
  tone?: keyof typeof TONES;
  visible?: boolean;
  onDismiss?: () => void;
}) {
  const bg = TONES[tone] || TONES.default;
  return (
    <div
      style={{
        position: "absolute",
        bottom: 24,
        left: "50%",
        transform: `translateX(-50%) translateY(${visible ? "0" : "12px"})`,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "all var(--duration-base) var(--ease-standard)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: bg,
        color: "var(--paper-0)",
        padding: "12px 18px",
        borderRadius: "var(--radius-md)",
        font: "var(--text-body-medium)",
        boxShadow: "var(--shadow-md)",
        whiteSpace: "nowrap",
        zIndex: 80,
      }}
    >
      {message}
      {onDismiss && (
        <span onClick={onDismiss} style={{ cursor: "pointer", opacity: 0.7, display: "inline-flex" }}>
          <X size={14} strokeWidth={1.8} />
        </span>
      )}
    </div>
  );
}
