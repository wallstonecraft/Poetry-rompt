import React from 'react';

export function Input({ label, placeholder, value, onChange, error, disabled = false, style }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && <span style={{ font: 'var(--text-label)', letterSpacing: 'var(--tracking-label)', color: 'var(--text-secondary)' }}>{label}</span>}
      <input
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          font: 'var(--text-body)',
          padding: '11px 14px',
          borderRadius: 'var(--radius-md)',
          border: `1.5px solid ${error ? 'var(--state-error)' : focused ? 'var(--brand-primary)' : 'var(--border-hairline)'}`,
          background: disabled ? 'var(--paper-1)' : 'var(--paper-0)',
          color: 'var(--text-primary)',
          outline: 'none',
          transition: 'border-color var(--duration-fast) var(--ease-standard)',
        }}
      />
      {error && <span style={{ font: 'var(--text-caption)', color: 'var(--state-error)' }}>{error}</span>}
    </label>
  );
}
