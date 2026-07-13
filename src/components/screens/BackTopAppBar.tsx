"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { TopAppBar } from "@/components/ui/navigation/TopAppBar";

/** Server Components can't hand a client-only `onBack` closure down to
 * TopAppBar directly, so this small client wrapper supplies it — every
 * pushed (non-tab) screen uses this instead of TopAppBar directly. */
export function BackTopAppBar({ title, right, style }: { title: string; right?: ReactNode; style?: React.CSSProperties }) {
  const router = useRouter();
  return <TopAppBar title={title} onBack={() => router.back()} right={right} style={style} />;
}
