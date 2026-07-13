"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { IconButton } from "@/components/ui/forms/IconButton";
import { ReportAction, type ReportReasonValue } from "@/components/ui/feedback/ReportAction";
import { toggleAppreciation } from "@/lib/actions/social";
import { submitReport } from "@/lib/actions/reports";

export function FavoriteToggle({ poemId, initialLiked }: { poemId: string; initialLiked: boolean }) {
  const [liked, setLiked] = useState(initialLiked);
  const [, startTransition] = useTransition();
  return (
    <IconButton
      aria-label={liked ? "Unlike" : "Favorite"}
      active={liked}
      style={{ color: liked ? "var(--heather-500)" : "var(--ink-1)" }}
      onClick={() => {
        const next = !liked;
        setLiked(next);
        startTransition(() => void toggleAppreciation(poemId, next));
      }}
    >
      <Heart size={18} strokeWidth={1.8} fill={liked ? "currentColor" : "none"} />
    </IconButton>
  );
}

export function ReportMenu({ poemId, poetId }: { poemId?: string; poetId?: string }) {
  const [, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  if (done) {
    return <span style={{ font: "var(--text-caption)", color: "var(--text-placeholder)", padding: "0 8px" }}>Reported</span>;
  }

  return (
    <ReportAction
      onReport={(reason: ReportReasonValue) => {
        setDone(true);
        startTransition(() => void submitReport({ poemId, poetId }, reason));
      }}
    />
  );
}
