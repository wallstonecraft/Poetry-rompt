"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/database.types";
import type { PoemContent } from "@/lib/richtext";

export async function createFragment(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("fragments").insert({ author_id: user.id, text: trimmed });
  if (error) throw error;

  revalidatePath("/fragments");
}

/** One-directional: the fragment is kept (not deleted) and gets
 * promoted_to_poem_id set, so it quietly drops out of the active list
 * without losing the capture history. Opens the new draft in freeform mode
 * — the fragment's text becomes a single unformatted line, never carrying
 * any of the spans/marks formatting poems support. */
export async function promoteFragment(fragmentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: fragment, error: fragmentError } = await supabase
    .from("fragments")
    .select("text")
    .eq("id", fragmentId)
    .single();
  if (fragmentError) throw fragmentError;

  const content: PoemContent = {
    lines: [{ spans: fragment.text ? [{ text: fragment.text, marks: [] }] : [] }],
  };

  const { data: poem, error: poemError } = await supabase
    .from("poems")
    .insert({ author_id: user.id, title: "", content: content as unknown as Json, status: "draft" })
    .select("id")
    .single();
  if (poemError) throw poemError;

  const { error: updateError } = await supabase
    .from("fragments")
    .update({ promoted_to_poem_id: poem.id })
    .eq("id", fragmentId);
  if (updateError) throw updateError;

  redirect(`/write/${poem.id}`);
}
