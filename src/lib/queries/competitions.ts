import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface CompetitionRecord {
  id: string;
  slug: string;
  title: string;
  theme: string;
  prize: string;
  closesAt: string;
}

export async function getCompetitions(): Promise<CompetitionRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("competitions")
    .select("id, slug, title, theme, prize, closes_at")
    .order("closes_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    theme: c.theme,
    prize: c.prize,
    closesAt: c.closes_at,
  }));
}

export async function getCompetition(id: string): Promise<CompetitionRecord | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("competitions")
    .select("id, slug, title, theme, prize, closes_at")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data
    ? { id: data.id, slug: data.slug, title: data.title, theme: data.theme, prize: data.prize, closesAt: data.closes_at }
    : null;
}
