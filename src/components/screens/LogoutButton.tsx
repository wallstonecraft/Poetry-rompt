"use client";

import { Button } from "@/components/ui/forms/Button";
import { signOut } from "@/lib/actions/auth";

export function LogoutButton() {
  return (
    <Button variant="ghost" style={{ color: "var(--state-error)", width: "100%" }} onClick={() => void signOut()}>
      Log out
    </Button>
  );
}
