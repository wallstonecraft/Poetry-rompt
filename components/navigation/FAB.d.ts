import { ReactNode, CSSProperties, MouseEventHandler } from 'react';

export interface FABProps {
  children: ReactNode;
  onClick?: MouseEventHandler;
  style?: CSSProperties;
}

export function FAB(props: FABProps): JSX.Element;
