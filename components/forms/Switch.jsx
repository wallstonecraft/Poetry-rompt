import React from 'react';

export function Switch({ checked = false, onChange, label, style }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer', ...style }}>
      {label && <span style={{ font: 'var(--text-body)', color: 'var(--text-primary)' }}>{label}</span>}
      <span
        onClick={() => onChange && onChange(!checked)}
        style={{
          width: 44,
          height: 26,
          borderRadius: 'var(--radius-full)',
          background: checked ? 'var(--brand-primary)' : 'var(--paper-3)',
          position: 'relative',
          transition: 'background var(--duration-base) var(--ease-standard)',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: checked ? 21 : 3,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: 'var(--paper-0)',
            boxShadow: 'var(--shadow-xs)',
            transition: 'left var(--duration-base) var(--ease-standard)',
          }}
        />
      </span>
    </label>
  );
}
