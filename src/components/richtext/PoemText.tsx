import { spansToSafeHtml, type PoemContent } from "@/lib/richtext";

/**
 * Full formatting, exact line breaks — for the poem detail screen, the
 * Publish confirmation preview, the Featured Poet screen, and the
 * writing/editing surface's own read-only bits. Never used for excerpts:
 * those strip marks to plain text (see poemContentToPlainText) and render
 * as a single pre-line block instead of one element per line.
 */
export function PoemText({ content, style }: { content: PoemContent; style?: React.CSSProperties }) {
  return (
    <div style={style}>
      {content.lines.map((line, i) => (
        <div
          key={i}
          style={{ minHeight: "1.6em" }}
          // Safe: spansToSafeHtml is a closed bold/italic mapping over
          // escaped text, never arbitrary stored markup.
          dangerouslySetInnerHTML={{ __html: spansToSafeHtml(line.spans) || "&nbsp;" }}
        />
      ))}
    </div>
  );
}
