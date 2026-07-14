import "server-only";
import { createClient } from "@/lib/supabase/server";
import { poemContentToPlainText, type PoemContent } from "@/lib/richtext";
import type { ReportReason, ReportStatus } from "@/lib/supabase/database.types";

export async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("is_admin").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data?.is_admin ?? false;
}

export interface ReportRecord {
  id: string;
  reason: ReportReason;
  status: ReportStatus;
  outcome: string | null;
  createdAt: string;
  reporter: { id: string; name: string } | null;
  poem: { id: string; title: string; excerpt: string; author: { id: string; name: string } | null } | null;
  reportedPoet: { id: string; name: string } | null;
}

type ReportRow = {
  id: string;
  reason: ReportReason;
  status: ReportStatus;
  outcome: string | null;
  created_at: string;
  reporter: { id: string; name: string } | null;
  poem: { id: string; title: string; content: unknown; author: { id: string; name: string } | null } | null;
  reported_poet: { id: string; name: string } | null;
};

const REPORT_SELECT =
  "id, reason, status, outcome, created_at, reporter:profiles!reports_reporter_id_fkey(id, name), poem:poems(id, title, content, author:profiles(id, name)), reported_poet:profiles!reports_reported_poet_id_fkey(id, name)";

function mapReport(row: ReportRow): ReportRecord {
  return {
    id: row.id,
    reason: row.reason,
    status: row.status,
    outcome: row.outcome,
    createdAt: row.created_at,
    reporter: row.reporter,
    poem: row.poem
      ? {
          id: row.poem.id,
          title: row.poem.title,
          excerpt: poemContentToPlainText(row.poem.content as unknown as PoemContent).slice(0, 280),
          author: row.poem.author,
        }
      : null,
    reportedPoet: row.reported_poet,
  };
}

/** Open reports first, then most recent — matches the "open reports"
 * scheduled-export framing while still surfacing already-actioned history
 * for context. RLS (reports_select_admin) is what actually restricts this
 * to an admin; this query trusts the database, same as everywhere else. */
export async function getReportsForReview(): Promise<ReportRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("reports").select(REPORT_SELECT).order("created_at", { ascending: false });
  if (error) throw error;
  const reports = ((data ?? []) as unknown as ReportRow[]).map(mapReport);
  // "open" first regardless of date, since that's the actual queue; status
  // isn't alphabetically orderable the way we want it (open should sort
  // before actioned/dismissed), so this is done client-side instead.
  return reports.sort((a, b) => (a.status === "open" ? 0 : 1) - (b.status === "open" ? 0 : 1));
}
