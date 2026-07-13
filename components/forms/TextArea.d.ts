import { CSSProperties, ChangeEventHandler } from 'react';

export interface TextAreaProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  rows?: number;
  /** Renders content in the italic serif poem typeface — use for the writing canvas itself. */
  poemStyle?: boolean;
  style?: CSSProperties;
}

export function TextArea(props: TextAreaProps): JSX.Element;
