"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CompetitionEnteredOverlay } from "./CompetitionEnteredOverlay";

/** Shows the "Competition entered" celebration once, right after a
 * competition-linked poem is published, then strips the `entered` param so
 * refreshing the feed doesn't replay it. */
export function FeedEnteredOverlay({ competitionTitle }: { competitionTitle: string }) {
  const router = useRouter();
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <CompetitionEnteredOverlay
      competitionTitle={competitionTitle}
      onDone={() => {
        setShow(false);
        router.replace("/feed", { scroll: false });
      }}
    />
  );
}
