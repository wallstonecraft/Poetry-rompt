#!/usr/bin/env node
// Scheduled export of the moderation queue into a reviewable JSON file.
//
// Deliberately does not use a service-role key (this project doesn't have
// one) -- it signs in as the admin account instead, and relies on the
// reports_select_admin RLS policy (see supabase/migrations/0009_moderation.sql)
// to actually restrict what comes back. If ADMIN_EMAIL isn't an admin
// (profiles.is_admin), this returns zero rows rather than failing loudly --
// RLS silently filters rather than erroring.
//
// Usage:
//   NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
//   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=... \
//   node scripts/export-reports.mjs [output-path]
//
// Run manually, or on a schedule (cron/launchd) pointed at this file. The
// output path defaults to reports-export-<date>.json in the current
// directory.

import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "node:fs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    "Missing required env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, ADMIN_EMAIL, ADMIN_PASSWORD",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const { error: authError } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
if (authError) {
  console.error("Failed to sign in:", authError.message);
  process.exit(1);
}

const { data, error } = await supabase
  .from("reports")
  .select(
    "id, reason, status, outcome, created_at, actioned_at, " +
      "reporter:profiles!reports_reporter_id_fkey(id, name), " +
      "poem:poems(id, title, content, author:profiles(id, name)), " +
      "reported_poet:profiles!reports_reported_poet_id_fkey(id, name)",
  )
  .eq("status", "open")
  .order("created_at", { ascending: true });

if (error) {
  console.error("Failed to fetch reports:", error.message);
  process.exit(1);
}

const outputPath = process.argv[2] ?? `reports-export-${new Date().toISOString().slice(0, 10)}.json`;
writeFileSync(outputPath, JSON.stringify(data ?? [], null, 2));

console.log(`Exported ${(data ?? []).length} open report(s) to ${outputPath}`);
