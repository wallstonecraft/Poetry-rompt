import { ReactNode, CSSProperties } from 'react';

export interface BottomTabItem { value: string; label: string; icon: ReactNode; }

export interface BottomTabBarProps {
  items: BottomTabItem[];
  value: string;
  onChange?: (value: string) => void;
  style?: CSSProperties;
}

export function BottomTabBar(props: BottomTabBarProps): JSX.Element;
