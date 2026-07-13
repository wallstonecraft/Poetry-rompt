"use client";

import { Heart } from "lucide-react";
import type { CSSProperties } from "react";
import { Card } from "./Card";
import { Avatar } from "./Avatar";
import { Tag } from "../feedback/Tag";
import { Badge } from "../feedback/Badge";
import { poemContentToPlainText, type PoemContent } from "@/lib/richtext";

export interface PoemCardPoem {
  id: string;
  title: string;
  content: PoemContent;
  tags: string[];
  date: string;
  status?: "draft" | "published";
  author?: { id: string; name: string; avatarUrl?: string | null } | null;
  competitionTitle?: string | null;
}

/* feed: byline + 3-line-clamped excerpt (marks stripped, line breaks kept) +
   like + "Read the full poem" link. library: same shape but a Draft badge
   and "Saved {when}" timestamp replace the byline, matching My Profile's
   Published/Drafts list. full: complete poem, formatting preserved exactly
   — provided for embedding (the poem detail screen renders via PoemText
   directly rather than through this card). */
export function PoemCard({
  poem,
  variant = "feed",
  onOpen,
  onOpenPoet,
  liked = false,
  onLikeChange,
  style,
}: {
  poem: PoemCardPoem;
  variant?: "feed" | "library";
  onOpen?: (poem: PoemCardPoem) => void;
  onOpenPoet?: (author: NonNullable<PoemCardPoem["author"]>) => void;
  liked?: boolean;
  onLikeChange?: (next: boolean) => void;
  style?: CSSProperties;
}) {
  const excerpt = poemContentToPlainText(poem.content);
  const isDraft = poem.status === "draft";

  return (
    <Card interactive onClick={() => onOpen?.(poem)} style={{ marginBottom: 12, ...style }}>
      {variant === "feed" && poem.author && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onOpenPoet?.(poem.author!);
          }}
          style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}
        >
          <Avatar name={poem.author.name} size={28} src={poem.author.avatarUrl} />
          <span style={{ font: "var(--text-caption-medium)", color: "var(--text-secondary)" }}>{poem.author.name}</span>
          <span style={{ marginLeft: "auto", font: "var(--text-caption)", color: "var(--text-placeholder)" }}>{poem.date}</span>
        </div>
      )}
      {variant === "library" && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 8 }}>
          <div style={{ font: "var(--text-title)", color: "var(--text-primary)" }}>{poem.title}</div>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            {poem.competitionTitle && <Badge tone="accent">{poem.competitionTitle}</Badge>}
            {isDraft && <Badge tone="neutral">Draft</Badge>}
          </div>
        </div>
      )}
      {variant === "feed" && <div style={{ font: "var(--text-title)", color: "var(--text-primary)", marginBottom: 8 }}>{poem.title}</div>}
      <div
        style={{
          font: "var(--text-poem)",
          color: "var(--ink-2)",
          whiteSpace: "pre-line",
          marginBottom: poem.tags.length || variant === "library" ? 10 : 0,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {excerpt}
      </div>
      {(poem.tags.length > 0 || variant === "library") && (
        <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: variant === "feed" || !isDraft ? 10 : 0 }}>
          {poem.tags.map((t) => (
            <Tag key={t} style={{ padding: "3px 9px" }}>
              {t}
            </Tag>
          ))}
          {variant === "library" && (
            <span style={{ marginLeft: "auto", font: "var(--text-caption)", color: "var(--text-placeholder)" }}>
              {isDraft ? `Saved ${poem.date}` : poem.date}
            </span>
          )}
        </div>
      )}
      {(variant === "feed" || (variant === "library" && !isDraft)) && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4, marginLeft: -4 }}>
          <button
            aria-label={liked ? "Unlike" : "Like"}
            onClick={(e) => {
              e.stopPropagation();
              onLikeChange?.(!liked);
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              border: "none",
              background: "none",
              cursor: "pointer",
              color: liked ? "var(--heather-500)" : "var(--ink-3)",
              padding: "6px 4px",
            }}
          >
            <Heart size={18} strokeWidth={1.8} fill={liked ? "currentColor" : "none"} />
          </button>
          <span
            onClick={(e) => {
              e.stopPropagation();
              onOpen?.(poem);
            }}
            style={{ font: "var(--text-caption-medium)", color: "var(--green-700)", cursor: "pointer" }}
          >
            Read the full poem
          </span>
        </div>
      )}
    </Card>
  );
}
