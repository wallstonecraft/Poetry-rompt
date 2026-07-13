"use client";

import { useRouter } from "next/navigation";
import { Tabs } from "@/components/ui/data-display/Tabs";

export type FeedView = "all" | "following" | "discover";

export function FeedTabs({ value }: { value: FeedView }) {
  const router = useRouter();
  return (
    <Tabs
      style={{ marginBottom: 16 }}
      value={value}
      onChange={(v) => router.push(v === "all" ? "/feed" : `/feed?view=${v}`)}
      tabs={[
        { value: "all", label: "All" },
        { value: "following", label: "Following" },
        { value: "discover", label: "Discover" },
      ]}
    />
  );
}
