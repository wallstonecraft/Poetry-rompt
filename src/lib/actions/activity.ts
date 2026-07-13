"use server";

import { createClient } from "@/lib/supabase/server";

/** Streak is opens-based, not writing-based — called once per session from
 * the authenticated shell layout. Upsert is idempotent, so repeat calls on
 * the same day are harmless. */
export async function logAppOpen() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("app_opens")
    .upsert(
      { user_id: user.id, opened_on: new Date().toISOString().slice(0, 10) },
      { onConflict: "user_id,opened_on", ignoreDuplicates: true },
    );
}

export async function logPoemRead(poemId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("poem_reads")
    .upsert({ user_id: user.id, poem_id: poemId }, { onConflict: "user_id,poem_id", ignoreDuplicates: true });
}
