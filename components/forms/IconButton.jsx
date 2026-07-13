import React from 'react';

export function IconButton({ children, variant = 'ghost', size = 44, active = false, 'aria-label': ariaLabel, onClick, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const bg = variant === 'filled'
    ? (hover ? 'var(--brand-primary-hover)' : 'var(--brand-primary)')
    : (active ? 'var(--brand-subtle)' : hover ? 'var(--paper-1)' : 'transparent');
  const color = variant === 'filled' ? 'var(--text-on-brand)' : active ? 'var(--green-700)' : 'var(--ink-1)';

  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: size,
        height: size,
        borderRadius: 'var(--radius-full)',
        border: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: bg,
        color,
        cursor: 'pointer',
        transition: 'background var(--duration-fast) var(--ease-standard)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
