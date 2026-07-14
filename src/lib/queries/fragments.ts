import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface FragmentRecord {
  id: string;
  text: string;
  createdAt: string;
  lastShownAt: string | null;
  promotedToPoemId: string | null;
}

const FRAGMENT_SELECT = "id, text, created_at, last_shown_at, promoted_to_poem_id";

function mapFragment(row: {
  id: string;
  text: string;
  created_at: string;
  last_shown_at: string | null;
  promoted_to_poem_id: string | null;
}): FragmentRecord {
  return {
    id: row.id,
    text: row.text,
    createdAt: row.created_at,
    lastShownAt: row.last_shown_at,
    promotedToPoemId: row.promoted_to_poem_id,
  };
}

/** Active (not-yet-promoted) fragments, most recent first — what the
 * Fragments screen's flat list shows. */
export async function getActiveFragments(userId: string): Promise<FragmentRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fragments")
    .select(FRAGMENT_SELECT)
    .eq("author_id", userId)
    .is("promoted_to_poem_id", null)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapFragment);
}

export async function getActiveFragmentsCount(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("fragments")
    .select("id", { count: "exact", head: true })
    .eq("author_id", userId)
    .is("promoted_to_poem_id", null);
  if (error) throw error;
  return count ?? 0;
}

/** Lifetime total, including promoted ones — About You's "fragments
 * captured" is a practice record, not a count of what's still sitting
 * unpromoted (that's what the Fragments screen itself shows). */
export async function getFragmentsCapturedTotal(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("fragments")
    .select("id", { count: "exact", head: true })
    .eq("author_id", userId);
  if (error) throw error;
  return count ?? 0;
}
