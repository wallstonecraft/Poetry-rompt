"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  domToSpans,
  extractAfterCaret,
  getCaretOffset,
  mergeLineIntoPrevious,
  setCaretOffset,
} from "./domSerialize";
import { hasVisibleText, spansToSafeHtml, type PoemContent, type PoemLine, type PoemSpan } from "@/lib/richtext";

interface EditorLineModel {
  id: string;
  spans: PoemSpan[];
}

function fromPoemContent(content: PoemContent): EditorLineModel[] {
  const lines = content.lines.length ? content.lines : [{ spans: [] }];
  return lines.map((line) => ({ id: crypto.randomUUID(), spans: line.spans }));
}

function toPoemContent(lines: EditorLineModel[]): PoemContent {
  return { lines: lines.map((l): PoemLine => ({ spans: l.spans })) };
}

function FormatButton({
  label,
  char,
  italic,
  active,
  onMouseDown,
}: {
  label: string;
  char: string;
  italic?: boolean;
  active: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      aria-label={label}
      onMouseDown={onMouseDown}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 34,
        height: 34,
        borderRadius: "var(--radius-sm)",
        border: "none",
        cursor: "pointer",
        background: active ? "var(--brand-subtle)" : hover ? "var(--paper-1)" : "transparent",
        color: active ? "var(--green-700)" : "var(--ink-1)",
        font: "600 15px var(--font-sans)",
        fontStyle: italic ? "italic" : "normal",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background var(--duration-fast) var(--ease-standard)",
      }}
    >
      {char}
    </button>
  );
}

function EditorLine({
  initialHtml,
  placeholder,
  registerRef,
  onInput,
  onKeyDown,
  onPaste,
  onFocus,
  onBlur,
  onSelectionChange,
}: {
  initialHtml: string;
  placeholder?: string;
  registerRef: (el: HTMLDivElement | null) => void;
  onInput: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onPaste: (e: React.ClipboardEvent<HTMLDivElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  onSelectionChange: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  // Set once, on mount, and never again — the live DOM is the source of
  // truth for this line from here on. Re-applying it on every render is
  // exactly what would fight the browser for caret position.
  useEffect(() => {
    if (ref.current) ref.current.innerHTML = initialHtml;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={(el) => {
        ref.current = el;
        registerRef(el);
      }}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      onInput={onInput}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyUp={onSelectionChange}
      onMouseUp={onSelectionChange}
      style={{
        font: "var(--text-poem)",
        color: "var(--text-primary)",
        minHeight: "1.6em",
        outline: "none",
      }}
    />
  );
}

export function PoemEditor({
  value,
  onChange,
  placeholder = "Begin here...",
  style,
}: {
  value: PoemContent;
  onChange: (next: PoemContent) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}) {
  const linesRef = useRef<EditorLineModel[]>(fromPoemContent(value));
  const initialHtmlRef = useRef<Map<string, string>>(
    new Map(linesRef.current.map((l) => [l.id, spansToSafeHtml(l.spans)])),
  );
  const lineElsRef = useRef<(HTMLDivElement | null)[]>([]);
  const activeLineIndexRef = useRef<number | null>(null);
  const pendingCaretRef = useRef<{ lineId: string; offset: number } | null>(null);

  const [lineIds, setLineIds] = useState<string[]>(linesRef.current.map((l) => l.id));
  const [focused, setFocused] = useState(false);
  const [isEmpty, setIsEmpty] = useState(!hasVisibleText(value));
  const [activeMarks, setActiveMarks] = useState({ bold: false, italic: false });

  function emitChange() {
    const content = toPoemContent(linesRef.current);
    setIsEmpty(!hasVisibleText(content));
    onChange(content);
  }

  function refreshActiveMarks() {
    try {
      setActiveMarks({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
      });
    } catch {
      // queryCommandState is best-effort; leave state as-is if unavailable.
    }
  }

  useLayoutEffect(() => {
    const pending = pendingCaretRef.current;
    if (!pending) return;
    pendingCaretRef.current = null;
    const idx = linesRef.current.findIndex((l) => l.id === pending.lineId);
    const el = lineElsRef.current[idx];
    if (el) {
      el.focus();
      setCaretOffset(el, pending.offset);
      activeLineIndexRef.current = idx;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineIds]);

  function handleInput(index: number) {
    const el = lineElsRef.current[index];
    if (!el) return;
    linesRef.current[index] = { ...linesRef.current[index], spans: domToSpans(el) };
    emitChange();
    refreshActiveMarks();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>, index: number) {
    const lineEl = lineElsRef.current[index];
    if (!lineEl) return;

    if (e.key === "Enter") {
      e.preventDefault();
      const afterSpans = extractAfterCaret(lineEl);
      linesRef.current[index] = { ...linesRef.current[index], spans: domToSpans(lineEl) };

      const newId = crypto.randomUUID();
      initialHtmlRef.current.set(newId, spansToSafeHtml(afterSpans));
      linesRef.current.splice(index + 1, 0, { id: newId, spans: afterSpans });

      setLineIds(linesRef.current.map((l) => l.id));
      pendingCaretRef.current = { lineId: newId, offset: 0 };
      emitChange();
      return;
    }

    if (e.key === "Backspace") {
      const sel = window.getSelection();
      const collapsed = sel ? sel.isCollapsed : true;
      const offset = getCaretOffset(lineEl);
      if (collapsed && offset === 0 && index > 0) {
        e.preventDefault();
        const prevEl = lineElsRef.current[index - 1];
        if (!prevEl) return;
        const mergeOffset = mergeLineIntoPrevious(prevEl, lineEl);
        const prevId = linesRef.current[index - 1].id;

        linesRef.current[index - 1] = { ...linesRef.current[index - 1], spans: domToSpans(prevEl) };
        initialHtmlRef.current.delete(linesRef.current[index].id);
        linesRef.current.splice(index, 1);

        setLineIds(linesRef.current.map((l) => l.id));
        pendingCaretRef.current = { lineId: prevId, offset: mergeOffset };
        emitChange();
      }
      return;
    }

    if (e.key === "Delete") {
      const sel = window.getSelection();
      const collapsed = sel ? sel.isCollapsed : true;
      const offset = getCaretOffset(lineEl);
      const len = lineEl.textContent?.length ?? 0;
      if (collapsed && offset === len && index < linesRef.current.length - 1) {
        e.preventDefault();
        const nextEl = lineElsRef.current[index + 1];
        if (!nextEl) return;
        mergeLineIntoPrevious(lineEl, nextEl);
        const currentId = linesRef.current[index].id;

        linesRef.current[index] = { ...linesRef.current[index], spans: domToSpans(lineEl) };
        initialHtmlRef.current.delete(linesRef.current[index + 1].id);
        linesRef.current.splice(index + 1, 1);

        setLineIds(linesRef.current.map((l) => l.id));
        pendingCaretRef.current = { lineId: currentId, offset };
        emitChange();
      }
      return;
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLDivElement>, index: number) {
    // Deliberately plain-text only: pasted markup is never trusted. Splits
    // multi-line paste across new lines the same way Enter does.
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    const lineEl = lineElsRef.current[index];
    if (!lineEl || !text) return;

    const parts = text.split(/\r\n|\r|\n/);
    document.execCommand("insertText", false, parts[0]);
    linesRef.current[index] = { ...linesRef.current[index], spans: domToSpans(lineEl) };

    let insertAt = index;
    for (let i = 1; i < parts.length; i++) {
      const newId = crypto.randomUUID();
      const spans: PoemSpan[] = parts[i] ? [{ text: parts[i], marks: [] }] : [];
      initialHtmlRef.current.set(newId, spansToSafeHtml(spans));
      insertAt += 1;
      linesRef.current.splice(insertAt, 0, { id: newId, spans });
    }

    if (parts.length > 1) {
      setLineIds(linesRef.current.map((l) => l.id));
      const lastId = linesRef.current[insertAt].id;
      pendingCaretRef.current = { lineId: lastId, offset: parts[parts.length - 1]?.length ?? 0 };
    }
    emitChange();
  }

  function applyMark(mark: "bold" | "italic") {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      const idx = activeLineIndexRef.current;
      if (idx == null) return;
      const el = lineElsRef.current[idx];
      if (!el) return;

      el.focus();
      document.execCommand(mark);

      linesRef.current[idx] = { ...linesRef.current[idx], spans: domToSpans(el) };
      emitChange();
      refreshActiveMarks();
    };
  }

  return (
    <div style={style}>
      <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
        <FormatButton label="Bold" char="B" active={activeMarks.bold} onMouseDown={applyMark("bold")} />
        <FormatButton label="Italic" char="I" italic active={activeMarks.italic} onMouseDown={applyMark("italic")} />
      </div>
      <div
        style={{
          padding: 14,
          borderRadius: "var(--radius-md)",
          border: `1.5px solid ${focused ? "var(--brand-primary)" : "var(--border-hairline)"}`,
          background: "var(--paper-0)",
          transition: "border-color var(--duration-fast) var(--ease-standard)",
        }}
      >
        {lineIds.map((id, index) => (
          <EditorLine
            key={id}
            initialHtml={initialHtmlRef.current.get(id) ?? ""}
            placeholder={index === 0 && isEmpty ? placeholder : undefined}
            registerRef={(el) => (lineElsRef.current[index] = el)}
            onInput={() => handleInput(index)}
            onKeyDown={(e) => {
              handleKeyDown(e, index);
            }}
            onPaste={(e) => handlePaste(e, index)}
            onFocus={() => {
              activeLineIndexRef.current = index;
              setFocused(true);
              refreshActiveMarks();
            }}
            onBlur={() => setFocused(false)}
            onSelectionChange={refreshActiveMarks}
          />
        ))}
      </div>
    </div>
  );
}
