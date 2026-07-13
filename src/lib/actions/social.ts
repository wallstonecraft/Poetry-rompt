"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/** The same heart used everywhere a poem can be liked. No count is ever
 * read back — callers only need to know the toggle succeeded. */
export async function toggleAppreciation(poemId: string, next: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  if (next) {
    const { error } = await supabase
      .from("appreciations")
      .upsert({ poem_id: poemId, user_id: user.id }, { onConflict: "poem_id,user_id", ignoreDuplicates: true });
    if (error) throw error;
  } else {
    const { error } = await supabase.from("appreciations").delete().eq("poem_id", poemId).eq("user_id", user.id);
    if (error) throw error;
  }

  revalidatePath("/feed");
  revalidatePath(`/poem/${poemId}`);
}

export async function toggleFollow(poetId: string, next: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  if (next) {
    const { error } = await supabase
      .from("follows")
      .upsert({ follower_id: user.id, followee_id: poetId }, { onConflict: "follower_id,followee_id", ignoreDuplicates: true });
    if (error) throw error;
  } else {
    const { error } = await supabase.from("follows").delete().eq("follower_id", user.id).eq("followee_id", poetId);
    if (error) throw error;
  }

  revalidatePath(`/poet/${poetId}`);
}
