// The poem content schema from DESIGN.md "Rich text content" — the single
// source of truth for how a poem's formatting is stored, everywhere it's
// stored or rendered. See supabase/migrations/0002_functions_triggers.sql
// (validate_poem_content) for the server-side mirror of isValidPoemContent.

export type Mark = "bold" | "italic";

export const VALID_MARKS: readonly Mark[] = ["bold", "italic"];

export interface PoemSpan {
  text: string;
  marks: Mark[];
}

export interface PoemLine {
  spans: PoemSpan[];
}

export interface PoemContent {
  lines: PoemLine[];
}

export function emptyPoemContent(): PoemContent {
  return { lines: [{ spans: [] }] };
}

export function isValidMark(value: unknown): value is Mark {
  return value === "bold" || value === "italic";
}

/** Structural validation mirroring the DB trigger — fail fast client-side
 * before ever sending something the server would reject anyway. */
export function isValidPoemContent(value: unknown): value is PoemContent {
  if (typeof value !== "object" || value === null) return false;
  const lines = (value as { lines?: unknown }).lines;
  if (!Array.isArray(lines)) return false;
  return lines.every((line) => {
    if (typeof line !== "object" || line === null) return false;
    const spans = (line as { spans?: unknown }).spans;
    if (!Array.isArray(spans)) return false;
    return spans.every((span) => {
      if (typeof span !== "object" || span === null) return false;
      const s = span as { text?: unknown; marks?: unknown };
      if (typeof s.text !== "string") return false;
      if (!Array.isArray(s.marks)) return false;
      return s.marks.every(isValidMark);
    });
  });
}

export function hasVisibleText(content: PoemContent): boolean {
  return content.lines.some((line) => line.spans.some((s) => s.text.length > 0));
}

/** Line breaks are structural and always preserved; marks are not. Used for
 * every excerpt location (feed/library/profile cards, Home's recent-poems
 * card, Weekly Featured Poet card, Daily Inspiration card) — never for the
 * full poem view. */
export function poemContentToPlainText(content: PoemContent): string {
  return content.lines.map((line) => line.spans.map((s) => s.text).join("")).join("\n");
}

export function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Closed mapping, by construction: "bold" -> <b>, "italic" -> <i>, nothing
 * else is ever interpreted. Text is escaped first, so this is safe to feed
 * to dangerouslySetInnerHTML even though the source is user-authored. */
export function spansToSafeHtml(spans: PoemSpan[]): string {
  return spans
    .map((span) => {
      let html = escapeHtml(span.text);
      if (span.marks.includes("bold")) html = `<b>${html}</b>`;
      if (span.marks.includes("italic")) html = `<i>${html}</i>`;
      return html;
    })
    .join("");
}
