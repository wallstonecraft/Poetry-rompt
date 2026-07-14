"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/** Each RPC checks is_admin itself and resolves the report atomically with
 * whatever action it took — these actions don't duplicate that check, they
 * trust the database, same as everywhere else admin-gated in this app. */

export async function dismissReport(reportId: string, outcome: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_dismiss_report", { p_report_id: reportId, p_outcome: outcome || null });
  if (error) throw error;
  revalidatePath("/admin/reports");
}

export async function removeReportedPoem(reportId: string, outcome: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_remove_reported_poem", { p_report_id: reportId, p_outcome: outcome || null });
  if (error) throw error;
  revalidatePath("/admin/reports");
}

export async function suspendReportedAccount(reportId: string, outcome: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_suspend_reported_account", { p_report_id: reportId, p_outcome: outcome || null });
  if (error) throw error;
  revalidatePath("/admin/reports");
}

export async function warnReportedAccount(reportId: string, message: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_warn_reported_account", { p_report_id: reportId, p_message: message || null });
  if (error) throw error;
  revalidatePath("/admin/reports");
}
