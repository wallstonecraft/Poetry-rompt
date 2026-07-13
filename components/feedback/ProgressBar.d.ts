import { CSSProperties } from 'react';

export interface ProgressBarProps {
  /** 0-100 */
  value?: number;
  tone?: 'brand' | 'accent';
  style?: CSSProperties;
}

export function ProgressBar(props: ProgressBarProps): JSX.Element;
