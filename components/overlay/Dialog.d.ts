import { ReactNode } from 'react';

export interface DialogProps {
  open: boolean;
  title?: string;
  children?: ReactNode;
  onClose?: () => void;
  /** Usually a row of Button elements. */
  actions?: ReactNode;
}

export function Dialog(props: DialogProps): JSX.Element;
