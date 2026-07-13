export interface PoemAuthor {
  name: string;
  avatar?: string;
}

export interface Poem {
  id: string | number;
  title: string;
  excerpt?: string;
  full?: string;
  tags?: string[];
  date?: string;
  author?: PoemAuthor;
}

export interface PoemCardProps {
  poem: Poem;
  variant?: 'feed' | 'full';
  onOpen?: (poem: Poem) => void;
  onOpenPoet?: (author: PoemAuthor) => void;
  liked?: boolean;
  onLikeChange?: (next: boolean) => void;
  style?: React.CSSProperties;
}

export declare function PoemCard(props: PoemCardProps): JSX.Element;
