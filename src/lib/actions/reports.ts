"use server";

import { createClient } from "@/lib/supabase/server";
import type { ReportReason } from "@/lib/supabase/database.types";

export async function submitReport(target: { poemId?: string; poetId?: string }, reason: ReportReason) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase.from("reports").insert({
    reporter_id: user.id,
    poem_id: target.poemId ?? null,
    reported_poet_id: target.poetId ?? null,
    reason,
  });
  if (error) throw error;
}
