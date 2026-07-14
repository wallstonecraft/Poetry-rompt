"use client";

import { useState, useTransition } from "react";
import { TextArea } from "@/components/ui/forms/TextArea";
import { Button } from "@/components/ui/forms/Button";
import { setPoemNote } from "@/lib/actions/poems";

/** Own-published-poem only, never shown to anyone else and never indicated
 * to other viewers in any way — no icon, no hint that a note exists. */
export function PoemNote({ poemId, initialNote }: { poemId: string; initialNote: string | null }) {
  const [note, setNote] = useState(initialNote ?? "");
  const [dirty, setDirty] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid var(--border-hairline)" }}>
      <div
        style={{
          font: "var(--text-label)",
          letterSpacing: "var(--tracking-label)",
          color: "var(--text-secondary)",
          marginBottom: 8,
        }}
      >
        PRIVATE NOTE
      </div>
      <TextArea
        value={note}
        onChange={(e) => {
          setNote(e.target.value);
          setDirty(true);
        }}
        placeholder="A private note to yourself about this poem…"
        rows={3}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
        <Button
          size="sm"
          variant="secondary"
          disabled={pending || !dirty}
          onClick={() =>
            startTransition(() => {
              void setPoemNote(poemId, note).then(() => setDirty(false));
            })
          }
        >
          Save note
        </Button>
        {!dirty && initialNote === note && note && (
          <span style={{ font: "var(--text-caption)", color: "var(--text-placeholder)" }}>Saved</span>
        )}
      </div>
    </div>
  );
}
