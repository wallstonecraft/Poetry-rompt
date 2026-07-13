import { ReactNode, CSSProperties } from 'react';

export interface BadgeProps {
  children: ReactNode;
  tone?: 'neutral' | 'brand' | 'accent' | 'warning' | 'error';
  style?: CSSProperties;
}

export function Badge(props: BadgeProps): JSX.Element;
