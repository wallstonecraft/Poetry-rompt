import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface PromptRecord {
  id: string;
  text: string;
  scheduledDate: string | null;
}

export interface CategoryRecord {
  id: string;
  slug: string;
  label: string;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export async function getTodaysPrompt(): Promise<PromptRecord | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("prompts")
    .select("id, text, scheduled_date")
    .eq("scheduled_date", todayISO())
    .maybeSingle();
  if (error) throw error;
  return data ? { id: data.id, text: data.text, scheduledDate: data.scheduled_date } : null;
}

export async function getPastPrompts(limit = 14): Promise<PromptRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("prompts")
    .select("id, text, scheduled_date")
    .not("scheduled_date", "is", null)
    .order("scheduled_date", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map((d) => ({ id: d.id, text: d.text, scheduledDate: d.scheduled_date }));
}

export async function getCategories(): Promise<CategoryRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("prompt_categories").select("id, slug, label").order("label");
  if (error) throw error;
  return data ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<CategoryRecord | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("prompt_categories").select("id, slug, label").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getCategoryPrompts(categoryId: string): Promise<PromptRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("prompts").select("id, text, scheduled_date").eq("category_id", categoryId);
  if (error) throw error;
  return (data ?? []).map((d) => ({ id: d.id, text: d.text, scheduledDate: d.scheduled_date }));
}
