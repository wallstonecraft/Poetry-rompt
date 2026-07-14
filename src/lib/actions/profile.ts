"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/** Public — visible to anyone viewing this poet's profile (see
 * poet/[id]/page.tsx), unlike a poem's private author_note. */
export async function updateBio(bio: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase.from("profiles").update({ bio: bio.trim() || null }).eq("id", user.id);
  if (error) throw error;

  revalidatePath("/profile");
  revalidatePath(`/poet/${user.id}`);
}
