export interface ToastProps {
  message: string;
  tone?: 'default' | 'success' | 'warning' | 'error';
  visible?: boolean;
  onDismiss?: () => void;
}

export function Toast(props: ToastProps): JSX.Element;
