import { ReactNode, CSSProperties, MouseEventHandler } from 'react';

/**
 * @startingPoint section="Forms" subtitle="Primary action button, 4 variants" viewport="700x260"
 */
export interface ButtonProps {
  children: ReactNode;
  /** Visual style. Primary = solid sage green, for the one main action per screen. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'md' | 'sm';
  disabled?: boolean;
  /** Optional leading icon element. */
  icon?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  style?: CSSProperties;
}

export function Button(props: ButtonProps): JSX.Element;
