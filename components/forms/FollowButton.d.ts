export interface FollowButtonProps {
  following?: boolean;
  onChange?: (next: boolean) => void;
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

export declare function FollowButton(props: FollowButtonProps): JSX.Element;
