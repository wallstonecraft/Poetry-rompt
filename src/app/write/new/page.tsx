import { redirect } from "next/navigation";
import { createDraft } from "@/lib/actions/poems";

// createDraft() creates a fresh private draft and redirects to /write/[id]
// itself — this route exists just so the FAB has a stable href.
export default async function NewWritePage() {
  await createDraft();
  redirect("/home");
}
