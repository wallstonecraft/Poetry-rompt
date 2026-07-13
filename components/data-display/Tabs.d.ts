import { CSSProperties } from 'react';

export interface TabItem { value: string; label: string; }

export interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange?: (value: string) => void;
  style?: CSSProperties;
}

export function Tabs(props: TabsProps): JSX.Element;
