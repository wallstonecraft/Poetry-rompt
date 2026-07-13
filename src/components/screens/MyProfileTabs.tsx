"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs } from "@/components/ui/data-display/Tabs";
import { PoemCard, type PoemCardPoem } from "@/components/ui/data-display/PoemCard";
import { EmptyState } from "@/components/ui/data-display/EmptyState";

export function MyProfileTabs({
  published,
  drafts,
  initialTab = "published",
}: {
  published: PoemCardPoem[];
  drafts: PoemCardPoem[];
  initialTab?: "published" | "draft";
}) {
  const [tab, setTab] = useState<"published" | "draft">(initialTab);
  const router = useRouter();
  const list = tab === "published" ? published : drafts;

  return (
    <div>
      <Tabs
        style={{ marginBottom: 16 }}
        value={tab}
        onChange={(v) => setTab(v as "published" | "draft")}
        tabs={[
          { value: "published", label: "Published" },
          { value: "draft", label: "Drafts" },
        ]}
      />
      {tab === "draft" && (
        <div style={{ font: "var(--text-caption)", color: "var(--text-placeholder)", marginBottom: 14 }}>
          Only you can see your drafts.
        </div>
      )}
      {list.length ? (
        list.map((poem) => (
          <PoemCard
            key={poem.id}
            poem={poem}
            variant="library"
            onOpen={(p) => router.push(`/poem/${p.id}`)}
          />
        ))
      ) : (
        <EmptyState
          title={tab === "draft" ? "No drafts" : "Nothing published yet"}
          body={
            tab === "draft"
              ? "Poems you start will sit here privately."
              : "This is what other poets will see on your profile."
          }
        />
      )}
    </div>
  );
}
