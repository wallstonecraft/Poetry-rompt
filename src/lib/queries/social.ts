import "server-only";
import { createClient } from "@/lib/supabase/server";

export async function getLikedPoemIds(userId: string, poemIds: string[]): Promise<Set<string>> {
  if (poemIds.length === 0) return new Set();
  const supabase = await createClient();
  const { data, error } = await supabase.from("appreciations").select("poem_id").eq("user_id", userId).in("poem_id", poemIds);
  if (error) throw error;
  return new Set((data ?? []).map((r) => r.poem_id));
}

export async function isLiked(userId: string, poemId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appreciations")
    .select("id")
    .eq("user_id", userId)
    .eq("poem_id", poemId)
    .maybeSingle();
  if (error) throw error;
  return !!data;
}

export async function isFollowing(followerId: string, followeeId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("follower_id", followerId)
    .eq("followee_id", followeeId)
    .maybeSingle();
  if (error) throw error;
  return !!data;
}
