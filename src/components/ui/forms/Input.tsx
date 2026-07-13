"use client";

import { useState, type CSSProperties, type InputHTMLAttributes } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style"> {
  label?: string;
  error?: string;
  style?: CSSProperties;
}

export function Input({ label, error, disabled = false, style, ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {label && (
        <span style={{ font: "var(--text-label)", letterSpacing: "var(--tracking-label)", color: "var(--text-secondary)" }}>
          {label}
        </span>
      )}
      <input
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          font: "var(--text-body)",
          padding: "11px 14px",
          borderRadius: "var(--radius-md)",
          border: `1.5px solid ${error ? "var(--state-error)" : focused ? "var(--brand-primary)" : "var(--border-hairline)"}`,
          background: disabled ? "var(--paper-1)" : "var(--paper-0)",
          color: "var(--text-primary)",
          outline: "none",
          transition: "border-color var(--duration-fast) var(--ease-standard)",
        }}
        {...rest}
      />
      {error && <span style={{ font: "var(--text-caption)", color: "var(--state-error)" }}>{error}</span>}
    </label>
  );
}
