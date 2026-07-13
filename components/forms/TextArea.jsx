import React from 'react';

export function TextArea({ label, placeholder, value, onChange, rows = 6, poemStyle = false, style }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && <span style={{ font: 'var(--text-label)', letterSpacing: 'var(--tracking-label)', color: 'var(--text-secondary)' }}>{label}</span>}
      <textarea
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          font: poemStyle ? 'var(--text-poem)' : 'var(--text-body)',
          fontStyle: poemStyle ? 'italic' : 'normal',
          padding: '14px',
          borderRadius: 'var(--radius-md)',
          border: `1.5px solid ${focused ? 'var(--brand-primary)' : 'var(--border-hairline)'}`,
          background: 'var(--paper-0)',
          color: 'var(--text-primary)',
          outline: 'none',
          resize: 'vertical',
          transition: 'border-color var(--duration-fast) var(--ease-standard)',
        }}
      />
    </label>
  );
}
