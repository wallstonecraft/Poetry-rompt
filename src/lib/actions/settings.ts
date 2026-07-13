"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database, ReminderFrequency } from "@/lib/supabase/database.types";

type SettingsUpdate = Database["public"]["Tables"]["user_settings"]["Update"];

export async function updateSettings(partial: {
  promptReminderEnabled?: boolean;
  promptReminderFrequency?: ReminderFrequency;
  streakReminderEnabled?: boolean;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const update: SettingsUpdate = {};
  if (partial.promptReminderEnabled !== undefined) update.prompt_reminder_enabled = partial.promptReminderEnabled;
  if (partial.promptReminderFrequency !== undefined) update.prompt_reminder_frequency = partial.promptReminderFrequency;
  if (partial.streakReminderEnabled !== undefined) update.streak_reminder_enabled = partial.streakReminderEnabled;

  const { error } = await supabase.from("user_settings").update(update).eq("user_id", user.id);
  if (error) throw error;

  revalidatePath("/settings");
}
