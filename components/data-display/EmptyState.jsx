import React from 'react';

export function EmptyState({ title, body, action, style }) {
  return (
    <div style={{ textAlign: 'center', padding: '56px 24px', ...style }}>
      <div style={{ font: 'var(--text-headline)', fontStyle: 'italic', color: 'var(--ink-2)', marginBottom: 8 }}>{title}</div>
      {body && <div style={{ font: 'var(--text-body)', color: 'var(--text-placeholder)', marginBottom: action ? 20 : 0 }}>{body}</div>}
      {action}
    </div>
  );
}
