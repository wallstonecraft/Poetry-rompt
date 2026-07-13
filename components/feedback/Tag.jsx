import React from 'react';

export function Tag({ children, selected = false, onClick, onRemove, style }) {
  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        font: 'var(--text-caption-medium)',
        padding: '6px 12px', borderRadius: 'var(--radius-full)',
        background: selected ? 'var(--brand-primary)' : 'var(--paper-1)',
        color: selected ? 'var(--text-on-brand)' : 'var(--text-secondary)',
        border: `1px solid ${selected ? 'transparent' : 'var(--border-hairline)'}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all var(--duration-fast) var(--ease-standard)',
        ...style,
      }}
    >
      {children}
      {onRemove && (
        <span onClick={(e) => { e.stopPropagation(); onRemove(); }} style={{ display: 'inline-flex', opacity: 0.7 }}>
          <svg width="10" height="10" viewBox="0 0 10 10"><path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
        </span>
      )}
    </span>
  );
}
