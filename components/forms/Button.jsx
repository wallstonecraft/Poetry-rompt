import React from 'react';

const SIZES = {
  md: { padding: '10px 20px', font: 'var(--text-button)', radius: 'var(--radius-md)' },
  sm: { padding: '7px 14px', font: '600 13px/1 var(--font-sans)', radius: 'var(--radius-sm)' },
};

function variantStyle(variant, disabled) {
  if (disabled) {
    return { background: 'var(--paper-2)', color: 'var(--text-placeholder)', border: '1px solid var(--border-hairline)' };
  }
  switch (variant) {
    case 'secondary':
      return { background: 'var(--brand-subtle)', color: 'var(--green-700)', border: '1px solid var(--brand-subtle-border)' };
    case 'ghost':
      return { background: 'transparent', color: 'var(--green-700)', border: '1px solid transparent' };
    case 'destructive':
      return { background: 'var(--state-error)', color: 'var(--paper-0)', border: '1px solid transparent' };
    case 'primary':
    default:
      return { background: 'var(--brand-primary)', color: 'var(--text-on-brand)', border: '1px solid transparent' };
  }
}

export function Button({ children, variant = 'primary', size = 'md', disabled = false, icon = null, onClick, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const sz = SIZES[size] || SIZES.md;
  const v = variantStyle(variant, disabled);

  let bg = v.background;
  if (!disabled && hover && variant === 'primary') bg = 'var(--brand-primary-hover)';
  if (!disabled && active && variant === 'primary') bg = 'var(--brand-primary-press)';
  if (!disabled && hover && variant === 'secondary') bg = 'var(--brand-subtle-border)';
  if (!disabled && hover && variant === 'ghost') bg = 'var(--paper-1)';
  if (!disabled && hover && variant === 'destructive') bg = 'oklch(48% 0.09 30)';

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        font: sz.font,
        padding: sz.padding,
        borderRadius: sz.radius,
        cursor: disabled ? 'default' : 'pointer',
        transition: 'background var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard)',
        transform: !disabled && active ? 'scale(0.97)' : 'scale(1)',
        ...v,
        background: bg,
        ...style,
      }}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
