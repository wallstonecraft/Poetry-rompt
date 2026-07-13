"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/forms/Button";
import { publishPoem } from "@/lib/actions/poems";

/** Publishes immediately, no confirmation step. If redirectTo is given,
 * navigates there afterward; otherwise refreshes the current route so its
 * Server Component data reflects the now-published poem. */
export function PublishNowButton({
  poemId,
  size = "md",
  label = "Publish",
  redirectTo,
}: {
  poemId: string;
  size?: "sm" | "md";
  label?: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      size={size}
      disabled={pending}
      onClick={() =>
        startTransition(() => {
          void publishPoem(poemId).then(() => {
            if (redirectTo) router.push(redirectTo);
            else router.refresh();
          });
        })
      }
    >
      {label}
    </Button>
  );
}
