import React from 'react';

export function Tooltip({ children, label, visible }) {
  const [hover, setHover] = React.useState(false);
  const show = visible !== undefined ? visible : hover;
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
      <span style={{
        position: 'absolute', bottom: '120%', left: '50%', transform: 'translateX(-50%)',
        background: 'var(--ink-1)', color: 'var(--paper-0)',
        font: 'var(--text-caption)', padding: '5px 10px', borderRadius: 'var(--radius-sm)',
        whiteSpace: 'nowrap', opacity: show ? 1 : 0, pointerEvents: 'none',
        transition: 'opacity var(--duration-fast) var(--ease-standard)',
      }}>
        {label}
      </span>
    </span>
  );
}
