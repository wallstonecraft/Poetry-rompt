import "server-only";
import { createClient } from "@/lib/supabase/server";

/** Only ever call this for a poem you already know is your own published
 * poem — the RPC itself also enforces that server-side, returning null for
 * anyone else's poem regardless of what's passed in. */
export async function getMyPoemNote(poemId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_my_poem_note", { p_poem_id: poemId });
  if (error) throw error;
  return data;
}
