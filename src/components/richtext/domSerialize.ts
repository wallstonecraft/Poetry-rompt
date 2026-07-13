import type { Mark, PoemSpan } from "@/lib/richtext";

function addMark(marks: Mark[], mark: Mark): Mark[] {
  return marks.includes(mark) ? marks : [...marks, mark].sort();
}

function marksEqual(a: Mark[], b: Mark[]): boolean {
  return a.length === b.length && a.every((m, i) => m === b[i]);
}

/**
 * Walks a line's live contentEditable DOM into the spans/marks model. Only
 * ever recognizes B/STRONG (bold) and I/EM (italic) ancestors — any other
 * element (a stray DIV, SPAN, BR from a paste, etc.) is transparently
 * unwrapped to its text content. This is what makes the editor safe against
 * pasted markup: no tag other than the closed bold/italic mapping can ever
 * survive into the stored model.
 */
export function domToSpans(container: Node): PoemSpan[] {
  const spans: PoemSpan[] = [];

  function walk(node: Node, marks: Mark[]) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? "";
      if (text.length === 0) return;
      const last = spans[spans.length - 1];
      if (last && marksEqual(last.marks, marks)) {
        last.text += text;
      } else {
        spans.push({ text, marks: [...marks] });
      }
      return;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName;
      // Recognize both <b>/<i> tags and the inline-style form some browsers
      // produce for execCommand('bold'/'italic') when styleWithCSS is on —
      // either way, only bold/italic ever survive into the stored model.
      let nextMarks = marks;
      const fontWeight = el.style?.fontWeight;
      if (tag === "B" || tag === "STRONG" || fontWeight === "bold" || Number(fontWeight) >= 600) {
        nextMarks = addMark(nextMarks, "bold");
      }
      if (tag === "I" || tag === "EM" || el.style?.fontStyle === "italic") {
        nextMarks = addMark(nextMarks, "italic");
      }
      node.childNodes.forEach((child) => walk(child, nextMarks));
      return;
    }
  }

  container.childNodes.forEach((child) => walk(child, []));
  return spans;
}

/** Character offset of the caret within a line element, using the
 * select-to-range-string trick (works across browsers without walking nodes
 * by hand). */
export function getCaretOffset(lineEl: HTMLElement): number {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return 0;
  const range = sel.getRangeAt(0);
  if (!lineEl.contains(range.startContainer)) return 0;
  const preRange = range.cloneRange();
  preRange.selectNodeContents(lineEl);
  preRange.setEnd(range.endContainer, range.endOffset);
  return preRange.toString().length;
}

/** Places the caret at a character offset within a line element. */
export function setCaretOffset(lineEl: HTMLElement, offset: number) {
  const sel = window.getSelection();
  if (!sel) return;

  let remaining = offset;
  function find(node: Node): { node: Node; offset: number } | null {
    if (node.nodeType === Node.TEXT_NODE) {
      const len = node.textContent?.length ?? 0;
      if (remaining <= len) return { node, offset: remaining };
      remaining -= len;
      return null;
    }
    for (const child of Array.from(node.childNodes)) {
      const found = find(child);
      if (found) return found;
    }
    return null;
  }

  const target = find(lineEl) ?? { node: lineEl, offset: 0 };
  const range = document.createRange();
  range.setStart(target.node, target.offset);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

/**
 * Splits a line's live DOM at the current caret position. Extracts (removes
 * from the DOM, in place) everything from the caret to the end of the line
 * and returns it as spans for a brand-new next line — the "before" portion
 * is left untouched in the original DOM node, so its exact formatting
 * survives with no HTML round-trip.
 */
export function extractAfterCaret(lineEl: HTMLElement): PoemSpan[] {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return [];
  const range = sel.getRangeAt(0).cloneRange();
  range.setEnd(lineEl, lineEl.childNodes.length);
  const fragment = range.extractContents();
  return domToSpans(fragment);
}

/**
 * Moves a line's live DOM children onto the end of the previous line's DOM
 * (in place, preserving formatting exactly) and returns the character
 * offset where the merge happened, for caret placement.
 */
export function mergeLineIntoPrevious(prevEl: HTMLElement, currentEl: HTMLElement): number {
  const mergeOffset = prevEl.textContent?.length ?? 0;
  while (currentEl.firstChild) {
    prevEl.appendChild(currentEl.firstChild);
  }
  return mergeOffset;
}
