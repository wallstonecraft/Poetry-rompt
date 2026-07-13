import { ReactNode, CSSProperties } from 'react';

export interface CardProps {
  children: ReactNode;
  padding?: number;
  /** Lifts on hover — use for tappable poem/prompt cards in a list. */
  interactive?: boolean;
  style?: CSSProperties;
}

export function Card(props: CardProps): JSX.Element;
