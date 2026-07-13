import { ReactNode, CSSProperties, MouseEventHandler } from 'react';

export interface TagProps {
  children: ReactNode;
  selected?: boolean;
  onClick?: MouseEventHandler;
  /** Shows a remove (x) affordance when provided. */
  onRemove?: () => void;
  style?: CSSProperties;
}

export function Tag(props: TagProps): JSX.Element;
