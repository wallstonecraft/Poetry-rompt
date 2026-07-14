import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { NotificationType } from "@/lib/supabase/database.types";

export interface NotificationRecord {
  id: string;
  type: NotificationType;
  createdAt: string;
  readAt: string | null;
  actor: { id: string; name: string; avatarUrl: string | null } | null;
  poemTitle: string | null;
  message: string | null;
}

type NotificationRow = {
  id: string;
  type: string;
  created_at: string;
  read_at: string | null;
  actor: { id: string; name: string; avatar_url: string | null } | null;
  poem: { title: string } | null;
  message: string | null;
};

export async function getNotifications(userId: string): Promise<NotificationRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select(
      "id, type, created_at, read_at, message, actor:profiles!notifications_actor_id_fkey(id, name, avatar_url), poem:poems(title)",
    )
    .eq("recipient_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as unknown as NotificationRow[]).map((row) => ({
    id: row.id,
    type: row.type as NotificationType,
    createdAt: row.created_at,
    readAt: row.read_at,
    actor: row.actor ? { id: row.actor.id, name: row.actor.name, avatarUrl: row.actor.avatar_url } : null,
    poemTitle: row.poem?.title ?? null,
    message: row.message,
  }));
}

export async function hasUnreadNotifications(userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("recipient_id", userId)
    .is("read_at", null);
  if (error) throw error;
  return (count ?? 0) > 0;
}
