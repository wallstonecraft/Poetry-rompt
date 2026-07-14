"use client";

import { useState, useTransition } from "react";
import { Dialog } from "@/components/ui/overlay/Dialog";
import { Button } from "@/components/ui/forms/Button";
import { Input } from "@/components/ui/forms/Input";
import { deleteMyAccount } from "@/lib/actions/account";

const CONFIRM_WORD = "DELETE";

type Step = "closed" | "warning" | "confirm";

/** Two deliberate steps, not a single "Are you sure?" — a warning screen
 * explaining what's actually gone, then a typed confirmation before the
 * irreversible action is even enabled. Heavier visual weight than Log out
 * (bordered, not plain ghost text) since an accidental tap here can't be
 * undone. */
export function DeleteAccountFlow() {
  const [step, setStep] = useState<Step>("closed");
  const [confirmText, setConfirmText] = useState("");
  const [pending, startTransition] = useTransition();

  function close() {
    setStep("closed");
    setConfirmText("");
  }

  return (
    <>
      <Button
        variant="secondary"
        style={{ width: "100%", color: "var(--state-error)", borderColor: "var(--state-error)", background: "transparent" }}
        onClick={() => setStep("warning")}
      >
        Delete account
      </Button>

      <Dialog
        open={step === "warning"}
        title="Delete your account?"
        onClose={close}
        actions={
          <>
            <Button variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setStep("confirm")}>
              Continue
            </Button>
          </>
        }
      >
        <p style={{ margin: 0 }}>
          This permanently deletes your account and everything in it: every poem (published and drafts), fragments,
          private notes, follows, and notifications. Other people lose any appreciation or follow connected to your
          work.
        </p>
        <p style={{ margin: "10px 0 0" }}>This cannot be undone.</p>
      </Dialog>

      <Dialog
        open={step === "confirm"}
        title="Type DELETE to confirm"
        onClose={close}
        actions={
          <>
            <Button variant="ghost" disabled={pending} onClick={close}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={pending || confirmText !== CONFIRM_WORD}
              onClick={() => startTransition(() => void deleteMyAccount())}
            >
              {pending ? "Deleting…" : "Delete my account"}
            </Button>
          </>
        }
      >
        <p style={{ margin: 0 }}>
          Type <strong>{CONFIRM_WORD}</strong> below to permanently delete your account.
        </p>
        <Input
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={CONFIRM_WORD}
          autoFocus
          style={{ marginTop: 12 }}
        />
      </Dialog>
    </>
  );
}
