import React from 'react';

const TONES = {
  neutral: { bg: 'var(--paper-2)', color: 'var(--text-secondary)' },
  brand: { bg: 'var(--brand-subtle)', color: 'var(--green-700)' },
  accent: { bg: 'var(--accent-subtle)', color: 'var(--heather-600)' },
  warning: { bg: 'var(--state-warning-subtle)', color: 'oklch(40% 0.08 80)' },
  error: { bg: 'var(--state-error-subtle)', color: 'var(--state-error)' },
};

export function Badge({ children, tone = 'neutral', style }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      font: 'var(--text-caption-medium)', letterSpacing: 'var(--tracking-caption)',
      padding: '3px 10px', borderRadius: 'var(--radius-full)',
      background: t.bg, color: t.color, ...style,
    }}>
      {children}
    </span>
  );
}
