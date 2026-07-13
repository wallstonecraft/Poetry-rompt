"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { emptyPoemContent, isValidPoemContent, type PoemContent } from "@/lib/richtext";
import type { Json } from "@/lib/supabase/database.types";

/** A poem is always created as a private draft first, even when starting
 * from a prompt or a competition — publishing is always the same separate,
 * deliberate step afterward. */
export async function createDraft(promptId?: string | null, competitionId?: string | null) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("poems")
    .insert({
      author_id: user.id,
      title: "",
      content: emptyPoemContent() as unknown as Json,
      status: "draft",
      prompt_id: promptId ?? null,
      competition_id: competitionId ?? null,
    })
    .select("id")
    .single();
  if (error) throw error;

  redirect(`/write/${data.id}`);
}

/** Silent autosave — no save button anywhere calls this directly on a click;
 * the writing screen calls it on a debounce. RLS only allows this while the
 * poem is still a draft, so a stray call after publish is a harmless no-op. */
export async function saveDraft(poemId: string, title: string, content: PoemContent, tags: string[]) {
  if (!isValidPoemContent(content)) throw new Error("Invalid poem content");

  const supabase = await createClient();
  const { error } = await supabase
    .from("poems")
    .update({ title: title.trim() || "Untitled", content: content as unknown as Json, tags })
    .eq("id", poemId);
  if (error) throw error;
}

/** Not reversible: RLS's update policy only matches drafts, so once this
 * flips status there is no code path back to private. */
export async function publishPoem(poemId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("poems")
    .update({ status: "published", published_at: new Date().toISOString() })
    .eq("id", poemId);
  if (error) throw error;

  revalidatePath("/profile");
  revalidatePath("/feed");
  revalidatePath("/home");
}
