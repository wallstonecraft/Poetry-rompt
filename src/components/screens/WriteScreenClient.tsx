"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TopAppBar } from "@/components/ui/navigation/TopAppBar";
import { Button } from "@/components/ui/forms/Button";
import { Badge } from "@/components/ui/feedback/Badge";
import { PoemEditor } from "@/components/richtext/PoemEditor";
import { saveDraft, publishPoem } from "@/lib/actions/poems";
import { hasVisibleText, type PoemContent } from "@/lib/richtext";

/** A poem is always created as a private draft first (see createDraft) —
 * this screen edits and silently autosaves that draft, with a manual Save
 * button alongside for explicit control. Publish flushes the pending save
 * and publishes immediately (no confirmation step); the "Competition
 * entered" celebration happens on the Feed page right after, not here —
 * an entry only really counts once it's actually published. */
export function WriteScreenClient({
  poemId,
  initialTitle,
  initialContent,
  promptText,
  competitionTitle,
}: {
  poemId: string;
  initialTitle: string;
  initialContent: PoemContent;
  promptText: string;
  competitionTitle?: string | null;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState<PoemContent>(initialContent);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">(
    hasVisibleText(initialContent) || initialTitle ? "saved" : "idle",
  );
  const [publishing, startPublishTransition] = useTransition();
  const [, startTransition] = useTransition();

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestRef = useRef({ title, content });
  latestRef.current = { title, content };

  const hasContent = hasVisibleText(content) || title.trim().length > 0;

  function scheduleSave() {
    setStatus("saving");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const { title: t, content: c } = latestRef.current;
      startTransition(() => {
        void saveDraft(poemId, t, c, []).then(() => setStatus("saved"));
      });
    }, 700);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function flushSave(): Promise<void> {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const { title: t, content: c } = latestRef.current;
    return saveDraft(poemId, t, c, []);
  }

  function handleBack() {
    if (hasContent) void flushSave();
    else if (timeoutRef.current) clearTimeout(timeoutRef.current);
    router.back();
  }

  function handleManualSave() {
    setStatus("saving");
    startTransition(() => {
      void flushSave().then(() => {
        setStatus("saved");
        router.push("/profile?tab=draft");
      });
    });
  }

  function handlePublish() {
    startPublishTransition(() => {
      void flushSave()
        .then(() => publishPoem(poemId))
        .then(() => {
          const dest = competitionTitle ? `/feed?entered=${encodeURIComponent(competitionTitle)}` : "/feed";
          router.push(dest);
        });
    });
  }

  return (
    <div>
      <TopAppBar
        title="New Poem"
        onBack={handleBack}
        right={
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ font: "var(--text-caption)", color: "var(--text-placeholder)" }}>
              {status === "saving" ? "Saving…" : status === "saved" ? "Saved" : ""}
            </span>
            <Button variant="secondary" size="sm" onClick={handleManualSave}>
              Save to drafts
            </Button>
            <Button size="sm" disabled={!hasContent || publishing} onClick={handlePublish}>
              Publish
            </Button>
          </div>
        }
      />
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div style={{ font: "var(--text-caption)", color: "var(--text-placeholder)" }}>PROMPT</div>
          {competitionTitle && <Badge tone="accent">{competitionTitle}</Badge>}
        </div>
        <div style={{ font: "var(--text-prompt)", fontStyle: "italic", color: "var(--green-700)", marginBottom: 18 }}>{promptText}</div>
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            scheduleSave();
          }}
          placeholder="Title your poem…"
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            background: "transparent",
            font: "var(--text-headline)",
            color: "var(--text-primary)",
            marginBottom: 18,
            padding: 0,
          }}
        />
        <PoemEditor
          value={content}
          onChange={(next) => {
            setContent(next);
            scheduleSave();
          }}
          placeholder="Begin here..."
        />
      </div>
    </div>
  );
}
