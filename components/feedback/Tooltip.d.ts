import { ReactNode } from 'react';

export interface TooltipProps {
  children: ReactNode;
  label: string;
  /** Force-controlled visibility; omit to use hover. */
  visible?: boolean;
}

export function Tooltip(props: TooltipProps): JSX.Element;
