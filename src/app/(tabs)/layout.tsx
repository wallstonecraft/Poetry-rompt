import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth";
import { logAppOpen } from "@/lib/actions/activity";
import { TabShell } from "./TabShell";

export default async function TabsLayout({ children }: { children: ReactNode }) {
  await requireUser();
  await logAppOpen();
  return <TabShell>{children}</TabShell>;
}
