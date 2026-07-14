import "server-only";
import { createClient } from "@/lib/supabase/server";

/** Sum of completed sessions only — a session with no ended_at (hard
 * refresh, tab close) is excluded rather than estimated. */
export async function getWritingSecondsTotal(userId: string): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("writing_sessions")
    .select("started_at, ended_at")
    .eq("author_id", userId)
    .not("ended_at", "is", null);
  if (error) throw error;
  return (data ?? []).reduce((sum, row) => {
    if (!row.ended_at) return sum;
    const seconds = (new Date(row.ended_at).getTime() - new Date(row.started_at).getTime()) / 1000;
    return sum + Math.max(0, seconds);
  }, 0);
}
