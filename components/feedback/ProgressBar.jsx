import React from 'react';

export function ProgressBar({ value = 0, tone = 'brand', style }) {
  const color = tone === 'accent' ? 'var(--accent)' : 'var(--brand-primary)';
  return (
    <div style={{ height: 8, borderRadius: 'var(--radius-full)', background: 'var(--paper-2)', overflow: 'hidden', ...style }}>
      <div style={{
        width: `${Math.max(0, Math.min(100, value))}%`, height: '100%',
        background: color, borderRadius: 'var(--radius-full)',
        transition: 'width var(--duration-slow) var(--ease-standard)',
      }} />
    </div>
  );
}
