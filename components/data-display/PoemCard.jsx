import React from 'react';
import { Card } from './Card.jsx';
import { Avatar } from './Avatar.jsx';
import { Tag } from '../feedback/Tag.jsx';

/* Two variants:
   - "feed": byline + excerpt (first 2-3 lines, clamped), a like (heart)
     button, and a "Read the full poem" link. Used in the feed, home, and
     profile poem lists.
   - "full": complete poem text, whitespace/line-breaks preserved exactly.
     Used on the poem detail screen (not usually inside a Card at all —
     this variant is provided for embedding, e.g. a quoted poem). */

function HeartIcon({ filled }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 21s-7-4.6-9.5-9C.7 8.2 2.4 4.5 6 4.5c2 0 3.4 1.1 4 2.4.6-1.3 2-2.4 4-2.4 3.6 0 5.3 3.7 3.5 7.5-2.5 4.4-9.5 9-9.5 9z" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function PoemCard({ poem, variant = 'feed', onOpen, onOpenPoet, liked = false, onLikeChange, style }) {
  if (variant === 'full') {
    return (
      <div style={style}>
        <div style={{ font: 'var(--text-headline)', color: 'var(--text-primary)', marginBottom: 16 }}>{poem.title}</div>
        <div style={{ font: 'var(--text-poem)', fontStyle: 'italic', color: 'var(--ink-1)', whiteSpace: 'pre-line' }}>{poem.full}</div>
      </div>
    );
  }
  return (
    <Card interactive onClick={() => onOpen && onOpen(poem)} style={{ marginBottom: 12, ...style }}>
      <div
        onClick={(e) => { e.stopPropagation(); onOpenPoet && onOpenPoet(poem.author); }}
        style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}
      >
        <Avatar name={poem.author?.name || ''} size={28} src={poem.author?.avatar} />
        <span style={{ font: 'var(--text-caption-medium)', color: 'var(--text-secondary)' }}>{poem.author?.name}</span>
        <span style={{ marginLeft: 'auto', font: 'var(--text-caption)', color: 'var(--text-placeholder)' }}>{poem.date}</span>
      </div>
      <div style={{ font: 'var(--text-title)', color: 'var(--text-primary)', marginBottom: 8 }}>{poem.title}</div>
      <div
        style={{
          font: 'var(--text-poem)', fontStyle: 'italic', color: 'var(--ink-2)', whiteSpace: 'pre-line',
          marginBottom: poem.tags?.length ? 10 : 0,
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}
      >
        {poem.excerpt}
      </div>
      {poem.tags?.length > 0 && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          {poem.tags.map((t) => <Tag key={t} style={{ padding: '3px 9px' }}>{t}</Tag>)}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginLeft: -4 }}>
        <button
          aria-label={liked ? 'Unlike' : 'Like'}
          onClick={(e) => { e.stopPropagation(); onLikeChange && onLikeChange(!liked); }}
          style={{ display: 'inline-flex', alignItems: 'center', border: 'none', background: 'none', cursor: 'pointer', color: liked ? 'var(--heather-500)' : 'var(--ink-3)', padding: '6px 4px' }}
        >
          <HeartIcon filled={liked} />
        </button>
        <span
          onClick={(e) => { e.stopPropagation(); onOpen && onOpen(poem); }}
          style={{ font: 'var(--text-caption-medium)', color: 'var(--green-700)', cursor: 'pointer' }}
        >
          Read the full poem
        </span>
      </div>
    </Card>
  );
}
