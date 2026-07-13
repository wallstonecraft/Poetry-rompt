"use client";

import { useState, useTransition, type CSSProperties } from "react";
import { FollowButton } from "@/components/ui/forms/FollowButton";
import { toggleFollow } from "@/lib/actions/social";

export function FollowToggle({
  poetId,
  initialFollowing,
  size = "md",
  style,
}: {
  poetId: string;
  initialFollowing: boolean;
  size?: "sm" | "md";
  style?: CSSProperties;
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [, startTransition] = useTransition();

  return (
    <FollowButton
      following={following}
      size={size}
      style={style}
      onChange={(next) => {
        setFollowing(next);
        startTransition(() => void toggleFollow(poetId, next));
      }}
    />
  );
}
