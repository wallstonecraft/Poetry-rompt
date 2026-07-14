"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Genuinely irreversible: the RPC hard-deletes the auth.users row, which
 * cascades through every FK back to profiles (poems, fragments, follows,
 * appreciations, notifications, settings, activity) in one transaction.
 * Not a soft-delete — matches the Terms of Service's erasure commitment. */
export async function deleteMyAccount() {
  const supabase = await createClient();
  const { error } = await supabase.rpc("delete_my_account");
  if (error) throw error;
  await supabase.auth.signOut();
  redirect("/login");
}
