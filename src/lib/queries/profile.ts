import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { ReminderFrequency } from "@/lib/supabase/database.types";

export interface ProfileRecord {
  id: string;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
}

export interface SettingsRecord {
  promptReminderEnabled: boolean;
  promptReminderFrequency: ReminderFrequency;
  streakReminderEnabled: boolean;
}

export async function getProfile(userId: string): Promise<ProfileRecord | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("id, name, bio, avatar_url").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data ? { id: data.id, name: data.name, bio: data.bio, avatarUrl: data.avatar_url } : null;
}

export async function getSettings(userId: string): Promise<SettingsRecord | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_settings")
    .select("prompt_reminder_enabled, prompt_reminder_frequency, streak_reminder_enabled")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data
    ? {
        promptReminderEnabled: data.prompt_reminder_enabled,
        promptReminderFrequency: data.prompt_reminder_frequency,
        streakReminderEnabled: data.streak_reminder_enabled,
      }
    : null;
}
