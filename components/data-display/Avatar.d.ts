import { CSSProperties } from 'react';

export interface AvatarProps {
  name: string;
  size?: number;
  src?: string;
  style?: CSSProperties;
}

export function Avatar(props: AvatarProps): JSX.Element;
