import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { PoemContent } from "@/lib/richtext";

export interface WeeklyFeatureRecord {
  id: string;
  conversation: { q: string; a: string }[];
  poet: { id: string; name: string; avatarUrl: string | null };
  poem: { id: string; title: string; content: PoemContent; tags: string[] };
}

export interface DailyInspirationRecord {
  id: string;
  poem: { id: string; title: string; content: PoemContent; tags: string[]; byline: string | null };
}

const FEATURE_SELECT = "id, conversation, poet:profiles(id, name, avatar_url), poem:poems(id, title, content, tags)";

type FeatureRow = {
  id: string;
  conversation: unknown;
  poet: { id: string; name: string; avatar_url: string | null } | null;
  poem: { id: string; title: string; content: unknown; tags: string[] | null } | null;
};

function mapFeature(data: FeatureRow): WeeklyFeatureRecord | null {
  if (!data.poet || !data.poem) return null;
  return {
    id: data.id,
    conversation: (data.conversation as { q: string; a: string }[]) ?? [],
    poet: { id: data.poet.id, name: data.poet.name, avatarUrl: data.poet.avatar_url },
    poem: {
      id: data.poem.id,
      title: data.poem.title,
      content: data.poem.content as PoemContent,
      tags: data.poem.tags ?? [],
    },
  };
}

export async function getWeeklyFeature(): Promise<WeeklyFeatureRecord | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("featured_poets")
    .select(FEATURE_SELECT)
    .order("week_start", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ? mapFeature(data as unknown as FeatureRow) : null;
}

export async function getFeaturedPoetById(id: string): Promise<WeeklyFeatureRecord | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("featured_poets").select(FEATURE_SELECT).eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapFeature(data as unknown as FeatureRow) : null;
}

type DailyInspirationRow = {
  id: string;
  poem: { id: string; title: string; content: unknown; tags: string[] | null; editorial_byline: string | null } | null;
};

export async function getDailyInspiration(): Promise<DailyInspirationRecord | null> {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("daily_inspirations")
    .select("id, poem:poems(id, title, content, tags, editorial_byline)")
    .eq("scheduled_date", today)
    .maybeSingle();
  if (error) throw error;
  const row = data as DailyInspirationRow | null;
  if (!row || !row.poem) return null;
  return {
    id: row.id,
    poem: {
      id: row.poem.id,
      title: row.poem.title,
      content: row.poem.content as PoemContent,
      tags: row.poem.tags ?? [],
      byline: row.poem.editorial_byline,
    },
  };
}

function computeStreak(openedDates: string[]): number {
  const set = new Set(openedDates);
  let streak = 0;
  const cursor = new Date();
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (!set.has(key)) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export async function getStreak(userId: string): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("app_opens")
    .select("opened_on")
    .eq("user_id", userId)
    .order("opened_on", { ascending: false })
    .limit(400);
  if (error) throw error;
  return computeStreak((data ?? []).map((o) => o.opened_on));
}

export async function getPoemsWrittenCount(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("poems")
    .select("id", { count: "exact", head: true })
    .eq("author_id", userId)
    .eq("status", "published");
  if (error) throw error;
  return count ?? 0;
}

export async function getPoemsReadCount(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("poem_reads")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);
  if (error) throw error;
  return count ?? 0;
}
