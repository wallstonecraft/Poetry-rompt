import React from 'react';

export function Select({ label, value, onChange, options = [], style }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && <span style={{ font: 'var(--text-label)', letterSpacing: 'var(--tracking-label)', color: 'var(--text-secondary)' }}>{label}</span>}
      <select
        value={value}
        onChange={onChange}
        style={{
          font: 'var(--text-body)',
          padding: '11px 14px',
          borderRadius: 'var(--radius-md)',
          border: '1.5px solid var(--border-hairline)',
          background: 'var(--paper-0)',
          color: 'var(--text-primary)',
          outline: 'none',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  );
}
