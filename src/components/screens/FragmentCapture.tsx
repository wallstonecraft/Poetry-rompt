"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TextArea } from "@/components/ui/forms/TextArea";
import { Button } from "@/components/ui/forms/Button";
import { createFragment } from "@/lib/actions/fragments";

/** Plain text, no title — capturing a thought, not composing. */
export function FragmentCapture() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [pending, startTransition] = useTransition();

  function handleAdd() {
    const trimmed = text.trim();
    if (!trimmed) return;
    startTransition(() => {
      void createFragment(trimmed).then(() => {
        setText("");
        router.refresh();
      });
    });
  }

  return (
    <div>
      <TextArea value={text} onChange={(e) => setText(e.target.value)} placeholder="Capture a thought…" rows={2} />
      <Button size="sm" style={{ marginTop: 8 }} disabled={pending || !text.trim()} onClick={handleAdd}>
        Add
      </Button>
    </div>
  );
}
