import { CSSProperties, ChangeEventHandler } from 'react';

export interface SelectOption { value: string; label: string; }

export interface SelectProps {
  label?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  options: SelectOption[];
  style?: CSSProperties;
}

export function Select(props: SelectProps): JSX.Element;
