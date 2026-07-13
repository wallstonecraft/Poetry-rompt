import { ReactNode, CSSProperties, MouseEventHandler } from 'react';

export interface IconButtonProps {
  /** Icon glyph/element to render, e.g. an inline SVG or icon-font char. */
  children: ReactNode;
  variant?: 'ghost' | 'filled';
  size?: number;
  /** Shows the pressed/selected tint (ghost variant). */
  active?: boolean;
  'aria-label': string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  style?: CSSProperties;
}

export function IconButton(props: IconButtonProps): JSX.Element;
