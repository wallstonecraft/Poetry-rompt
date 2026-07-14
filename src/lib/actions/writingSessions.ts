"use server";

import { createClient } from "@/lib/supabase/server";

/** A session is just start/end timestamps around the write screen being
 * open. Started on mount, ended on unmount (see WriteScreenClient) — a
 * session that never gets an end (hard refresh, tab close) is simply
 * excluded from the About You total rather than estimated. */
export async function startWritingSession(poemId: string): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("writing_sessions")
    .insert({ author_id: user.id, poem_id: poemId })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function endWritingSession(sessionId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("writing_sessions")
    .update({ ended_at: new Date().toISOString() })
    .eq("id", sessionId);
  if (error) throw error;
}
