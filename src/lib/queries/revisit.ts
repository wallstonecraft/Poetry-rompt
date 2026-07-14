import "server-only";
import { createClient } from "@/lib/supabase/server";
import { poemContentToPlainText, type PoemContent } from "@/lib/richtext";

export interface RevisitItem {
  type: "fragment" | "draft";
  id: string;
  text: string;
  date: string;
}

type Candidate = RevisitItem & { lastShownAt: string | null };

const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

/** Resurfaces one old fragment or untouched draft on Home — "From your
 * notebook." Eligible pool: fragments older than 14 days (not yet
 * promoted) or drafts untouched for 14+ days. Prefers items never shown
 * before; picks randomly among ties. Shown at most once per day (treating
 * "session" at the same day-granularity the streak mechanic already uses)
 * and never twice in a row, since stamping last_shown_at on the picked item
 * makes it lose priority against never-shown items on the next pick. */
export async function getRevisitItem(userId: string): Promise<RevisitItem | null> {
  const supabase = await createClient();
  const todayStart = new Date().toISOString().slice(0, 10) + "T00:00:00.000Z";

  const [shownFragmentToday, shownDraftToday] = await Promise.all([
    supabase
      .from("fragments")
      .select("id", { count: "exact", head: true })
      .eq("author_id", userId)
      .gte("last_shown_at", todayStart),
    supabase
      .from("poems")
      .select("id", { count: "exact", head: true })
      .eq("author_id", userId)
      .eq("status", "draft")
      .gte("last_shown_at", todayStart),
  ]);
  if (shownFragmentToday.error) throw shownFragmentToday.error;
  if (shownDraftToday.error) throw shownDraftToday.error;
  if ((shownFragmentToday.count ?? 0) > 0 || (shownDraftToday.count ?? 0) > 0) return null;

  const cutoff = new Date(Date.now() - FOURTEEN_DAYS_MS).toISOString();

  const [fragmentsRes, draftsRes] = await Promise.all([
    supabase
      .from("fragments")
      .select("id, text, created_at, last_shown_at")
      .eq("author_id", userId)
      .is("promoted_to_poem_id", null)
      .lt("created_at", cutoff),
    supabase
      .from("poems")
      .select("id, content, updated_at, last_shown_at")
      .eq("author_id", userId)
      .eq("status", "draft")
      .lt("updated_at", cutoff),
  ]);
  if (fragmentsRes.error) throw fragmentsRes.error;
  if (draftsRes.error) throw draftsRes.error;

  const pool: Candidate[] = [
    ...(fragmentsRes.data ?? []).map((f) => ({
      type: "fragment" as const,
      id: f.id,
      text: f.text,
      date: f.created_at,
      lastShownAt: f.last_shown_at,
    })),
    ...(draftsRes.data ?? [])
      .map((p) => ({
        type: "draft" as const,
        id: p.id,
        text: poemContentToPlainText(p.content as unknown as PoemContent).trim(),
        date: p.updated_at,
        lastShownAt: p.last_shown_at,
      }))
      .filter((p) => p.text.length > 0),
  ];
  if (pool.length === 0) return null;

  const neverShown = pool.filter((c) => !c.lastShownAt);
  const candidates = neverShown.length > 0 ? neverShown : pool;
  const picked = candidates[Math.floor(Math.random() * candidates.length)];

  const now = new Date().toISOString();
  const { error: stampError } =
    picked.type === "fragment"
      ? await supabase.from("fragments").update({ last_shown_at: now }).eq("id", picked.id)
      : await supabase.from("poems").update({ last_shown_at: now }).eq("id", picked.id);
  if (stampError) throw stampError;

  return { type: picked.type, id: picked.id, text: picked.text, date: picked.date };
}
