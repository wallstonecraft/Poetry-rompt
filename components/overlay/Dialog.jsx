import React from 'react';

export function Dialog({ open, title, children, onClose, actions }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'oklch(20% 0.02 150 / 0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
    }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--paper-0)', borderRadius: 'var(--radius-xl)',
          padding: 24, width: 320, boxShadow: 'var(--shadow-lg)',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}
      >
        {title && <div style={{ font: 'var(--text-headline)', color: 'var(--text-primary)' }}>{title}</div>}
        <div style={{ font: 'var(--text-body)', color: 'var(--text-secondary)' }}>{children}</div>
        {actions && <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>{actions}</div>}
      </div>
    </div>
  );
}
