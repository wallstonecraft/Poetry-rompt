"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface AuthFormState {
  error: string | null;
  success: boolean;
  needsConfirmation?: boolean;
}

// redirect() deliberately does NOT happen inside these — calling it from a
// Server Action wired through useFormState corrupts the client-side state on
// Next.js 14.2 (throws NEXT_REDIRECT before the state can resolve). Instead
// these return a plain result and the client navigates on success.

export async function signUp(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
  if (error) return { error: error.message, success: false };

  // No session means the project requires email confirmation before login.
  if (!data.session) return { error: null, success: false, needsConfirmation: true };

  return { error: null, success: true };
}

export async function signIn(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message, success: false };

  return { error: null, success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
