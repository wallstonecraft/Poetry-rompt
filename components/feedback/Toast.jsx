import React from 'react';

const TONES = {
  success: { bg: 'var(--green-700)' },
  warning: { bg: 'oklch(45% 0.08 80)' },
  error: { bg: 'var(--state-error)' },
  default: { bg: 'var(--ink-1)' },
};

export function Toast({ message, tone = 'default', visible = true, onDismiss }) {
  const t = TONES[tone] || TONES.default;
  return (
    <div style={{
      position: 'absolute', bottom: 24, left: '50%', transform: `translateX(-50%) translateY(${visible ? '0' : '12px'})`,
      opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none',
      transition: 'all var(--duration-base) var(--ease-standard)',
      display: 'flex', alignItems: 'center', gap: 12,
      background: t.bg, color: 'var(--paper-0)',
      padding: '12px 18px', borderRadius: 'var(--radius-md)',
      font: 'var(--text-body-medium)', boxShadow: 'var(--shadow-md)',
      whiteSpace: 'nowrap',
    }}>
      {message}
      {onDismiss && (
        <span onClick={onDismiss} style={{ cursor: 'pointer', opacity: 0.7 }}>✕</span>
      )}
    </div>
  );
}
