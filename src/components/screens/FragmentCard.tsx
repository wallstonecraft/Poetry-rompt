"use client";

import { useTransition } from "react";
import { Card } from "@/components/ui/data-display/Card";
import { Button } from "@/components/ui/forms/Button";
import { promoteFragment } from "@/lib/actions/fragments";
import { formatRelativeOrDate } from "@/lib/format";
import type { FragmentRecord } from "@/lib/queries/fragments";

export function FragmentCard({ fragment }: { fragment: FragmentRecord }) {
  const [pending, startTransition] = useTransition();

  return (
    <Card style={{ marginBottom: 12 }}>
      <div style={{ font: "var(--text-body)", color: "var(--text-primary)", whiteSpace: "pre-line", marginBottom: 10 }}>
        {fragment.text}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ font: "var(--text-caption)", color: "var(--text-placeholder)" }}>
          {formatRelativeOrDate(fragment.createdAt)}
        </span>
        <Button
          size="sm"
          variant="ghost"
          disabled={pending}
          onClick={() => startTransition(() => void promoteFragment(fragment.id))}
        >
          Turn into a poem
        </Button>
      </div>
    </Card>
  );
}
