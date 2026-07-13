import React from 'react';

export function Radio({ label, checked = false, onChange, style }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer', ...style }}>
      <span
        onClick={() => onChange && onChange()}
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: `1.5px solid ${checked ? 'var(--brand-primary)' : 'var(--border-hairline)'}`,
          background: 'var(--paper-0)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {checked && <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--brand-primary)' }} />}
      </span>
      {label && <span style={{ font: 'var(--text-body)', color: 'var(--text-primary)' }}>{label}</span>}
    </label>
  );
}
