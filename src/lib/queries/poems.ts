import "server-only";
import { createClient } from "@/lib/supabase/server";
import { poemContentToPlainText, type PoemContent } from "@/lib/richtext";

export interface PoemRecord {
  id: string;
  title: string;
  content: PoemContent;
  tags: string[];
  status: "draft" | "published";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  isEditorial: boolean;
  editorialByline: string | null;
  author: { id: string; name: string; avatarUrl: string | null } | null;
  competitionTitle: string | null;
}

const POEM_SELECT =
  "id, title, content, tags, status, published_at, created_at, updated_at, is_editorial, editorial_byline, author:profiles(id, name, avatar_url), competition:competitions(title)";

type PoemRow = {
  id: string;
  title: string;
  content: unknown;
  tags: string[] | null;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
  is_editorial: boolean;
  editorial_byline: string | null;
  author: { id: string; name: string; avatar_url: string | null } | null;
  competition: { title: string } | null;
};

function mapPoem(row: PoemRow): PoemRecord {
  return {
    id: row.id,
    title: row.title,
    content: row.content as PoemContent,
    tags: row.tags ?? [],
    status: row.status,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isEditorial: row.is_editorial,
    editorialByline: row.editorial_byline,
    author: row.author ? { id: row.author.id, name: row.author.name, avatarUrl: row.author.avatar_url } : null,
    competitionTitle: row.competition?.title ?? null,
  };
}

/** The "All" tab: chronological, poets you follow plus recent public poems,
 * merged in one unfiltered stream — no ranking, no "for you". */
export async function getFeed(limit = 30): Promise<PoemRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("poems")
    .select(POEM_SELECT)
    .eq("status", "published")
    .eq("is_editorial", false)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(mapPoem as (row: unknown) => PoemRecord);
}

async function getFolloweeIds(userId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("follows").select("followee_id").eq("follower_id", userId);
  if (error) throw error;
  return (data ?? []).map((f) => f.followee_id);
}

/** The "Following" tab: only poems from poets you follow. */
export async function getFollowingFeed(userId: string, limit = 30): Promise<PoemRecord[]> {
  const followeeIds = await getFolloweeIds(userId);
  if (followeeIds.length === 0) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("poems")
    .select(POEM_SELECT)
    .eq("status", "published")
    .eq("is_editorial", false)
    .in("author_id", followeeIds)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(mapPoem as (row: unknown) => PoemRecord);
}

/** The "Discover" tab: poems from poets you don't yet follow (and not your
 * own), a lightweight way to find new poets beyond the main chronological
 * stream. */
export async function getDiscoverFeed(userId: string, limit = 30): Promise<PoemRecord[]> {
  const followeeIds = await getFolloweeIds(userId);
  const excludeIds = Array.from(new Set([...followeeIds, userId]));

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("poems")
    .select(POEM_SELECT)
    .eq("status", "published")
    .eq("is_editorial", false)
    .not("author_id", "in", `(${excludeIds.join(",")})`)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(mapPoem as (row: unknown) => PoemRecord);
}

export async function getMyRecentPublished(userId: string, limit = 3): Promise<PoemRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("poems")
    .select(POEM_SELECT)
    .eq("author_id", userId)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(mapPoem as (row: unknown) => PoemRecord);
}

export async function getMyPoems(userId: string, status: "draft" | "published"): Promise<PoemRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("poems")
    .select(POEM_SELECT)
    .eq("author_id", userId)
    .eq("status", status)
    .order(status === "draft" ? "updated_at" : "published_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapPoem as (row: unknown) => PoemRecord);
}

export async function getPoetPoems(poetId: string): Promise<PoemRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("poems")
    .select(POEM_SELECT)
    .eq("author_id", poetId)
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapPoem as (row: unknown) => PoemRecord);
}

/** RLS (poems_select_published_or_own) already guarantees this returns null
 * rather than someone else's draft — this function trusts the database, not
 * an application-level check. */
export async function getPoemDetail(id: string): Promise<PoemRecord | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("poems").select(POEM_SELECT).eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapPoem(data as unknown as PoemRow) : null;
}

export interface DraftForEditing extends PoemRecord {
  /** Resolved display text for the writing screen's "PROMPT" line —
   * whichever of prompt_id / competition_id the draft was started from. */
  promptText: string | null;
}

const DRAFT_SELECT =
  "id, title, content, tags, status, published_at, created_at, updated_at, is_editorial, editorial_byline, author:profiles(id, name, avatar_url), competition:competitions(title, theme), prompt:prompts(text)";

/** Words across everything you've ever written, drafts included — a
 * practice record, not a measure of public output. Derived from content at
 * read time rather than a maintained running counter, since this is a
 * once-a-visit page, not a hot path. */
export async function getWordsWritten(userId: string): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("poems").select("content").eq("author_id", userId);
  if (error) throw error;
  return (data ?? []).reduce((sum, row) => {
    const text = poemContentToPlainText(row.content as unknown as PoemContent).trim();
    return sum + (text ? text.split(/\s+/).length : 0);
  }, 0);
}

export async function getDraftForEditing(id: string): Promise<DraftForEditing | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("poems").select(DRAFT_SELECT).eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const row = data as unknown as PoemRow & { prompt: { text: string } | null; competition: { title: string; theme: string } | null };
  return { ...mapPoem(row), promptText: row.prompt?.text ?? row.competition?.theme ?? null };
}
