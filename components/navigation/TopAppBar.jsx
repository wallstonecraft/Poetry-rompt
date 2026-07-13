import React from 'react';

export function TopAppBar({ title, onBack, right, style }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '14px 12px', background: 'var(--bg-app)',
      borderBottom: '1px solid var(--border-hairline)', ...style,
    }}>
      {onBack && (
        <button onClick={onBack} aria-label="Back" style={{
          border: 'none', background: 'none', cursor: 'pointer', color: 'var(--ink-1)',
          width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      )}
      <div style={{ flex: 1, font: 'var(--text-title)', color: 'var(--text-primary)' }}>{title}</div>
      {right}
    </div>
  );
}
