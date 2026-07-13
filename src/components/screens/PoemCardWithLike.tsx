"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { PoemCard, type PoemCardPoem } from "@/components/ui/data-display/PoemCard";
import { toggleAppreciation } from "@/lib/actions/social";

export function PoemCardWithLike({
  poem,
  variant = "feed",
  initialLiked,
}: {
  poem: PoemCardPoem;
  variant?: "feed" | "library";
  initialLiked: boolean;
}) {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [, startTransition] = useTransition();

  return (
    <PoemCard
      poem={poem}
      variant={variant}
      liked={liked}
      onOpen={() => router.push(`/poem/${poem.id}`)}
      onOpenPoet={(author) => router.push(`/poet/${author.id}`)}
      onLikeChange={(next) => {
        setLiked(next);
        startTransition(() => void toggleAppreciation(poem.id, next));
      }}
    />
  );
}
