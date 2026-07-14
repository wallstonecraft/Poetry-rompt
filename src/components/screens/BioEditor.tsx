"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/forms/Input";
import { Button } from "@/components/ui/forms/Button";
import { updateBio } from "@/lib/actions/profile";

const MAX_LENGTH = 140;

/** A one-line bio, visible to anyone viewing this poet's profile — see
 * DESIGN.md's poet profile screen ("avatar, name, one-line bio"). */
export function BioEditor({ initialBio }: { initialBio: string | null }) {
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(initialBio ?? "");
  const [pending, startTransition] = useTransition();

  if (!editing) {
    return (
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        {bio && <div style={{ font: "var(--text-caption)", color: "var(--text-secondary)" }}>{bio}</div>}
        <button
          onClick={() => setEditing(true)}
          style={{
            font: "var(--text-caption-medium)",
            color: "var(--green-700)",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          {bio ? "Edit" : "Add a bio"}
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
      <Input
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="A short bio…"
        maxLength={MAX_LENGTH}
        autoFocus
      />
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Button
          size="sm"
          disabled={pending}
          onClick={() =>
            startTransition(() => {
              void updateBio(bio).then(() => setEditing(false));
            })
          }
        >
          Save
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={pending}
          onClick={() => {
            setBio(initialBio ?? "");
            setEditing(false);
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
