"use client";

import { useTransition } from "react";
import { createDraft } from "@/lib/actions/poems";
import { Button } from "@/components/ui/forms/Button";
import type { CSSProperties } from "react";

export function StartWritingButton({
  promptId,
  competitionId,
  label = "Start writing",
  variant = "primary",
  style,
}: {
  promptId?: string;
  competitionId?: string;
  label?: string;
  variant?: "primary" | "secondary" | "ghost";
  style?: CSSProperties;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      variant={variant}
      disabled={pending}
      style={style}
      onClick={() => startTransition(() => void createDraft(promptId, competitionId))}
    >
      {label}
    </Button>
  );
}
