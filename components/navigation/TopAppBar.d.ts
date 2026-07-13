import { ReactNode, CSSProperties } from 'react';

export interface TopAppBarProps {
  title: string;
  onBack?: () => void;
  /** Trailing element(s) — usually an IconButton. */
  right?: ReactNode;
  style?: CSSProperties;
}

export function TopAppBar(props: TopAppBarProps): JSX.Element;
