// Hand-written to match supabase/migrations/0001_init_schema.sql. Regenerate
// with `supabase gen types typescript` once a live project exists, and diff
// against this file rather than trusting it blindly.

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type PoemStatus = "draft" | "published";
export type NotificationType = "appreciation" | "follow" | "streak_risk";
export type ReportReason = "spam" | "harassment" | "plagiarism" | "other";
export type ReminderFrequency = "daily" | "weekly";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          bio: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          bio?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      Relationships: [];
      };
      prompt_categories: {
        Row: { id: string; slug: string; label: string };
        Insert: { id?: string; slug: string; label: string };
        Update: Partial<Database["public"]["Tables"]["prompt_categories"]["Insert"]>;
      Relationships: [];
      };
      prompts: {
        Row: {
          id: string;
          text: string;
          category_id: string | null;
          scheduled_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          text: string;
          category_id?: string | null;
          scheduled_date?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["prompts"]["Insert"]>;
      Relationships: [];
      };
      competitions: {
        Row: {
          id: string;
          slug: string;
          title: string;
          theme: string;
          prize: string;
          opens_at: string;
          closes_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          theme: string;
          prize: string;
          opens_at?: string;
          closes_at: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["competitions"]["Insert"]>;
      Relationships: [];
      };
      poems: {
        Row: {
          id: string;
          author_id: string | null;
          is_editorial: boolean;
          editorial_byline: string | null;
          title: string;
          content: Json;
          status: PoemStatus;
          tags: string[];
          prompt_id: string | null;
          competition_id: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id?: string | null;
          is_editorial?: boolean;
          editorial_byline?: string | null;
          title: string;
          content: Json;
          status?: PoemStatus;
          tags?: string[];
          prompt_id?: string | null;
          competition_id?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["poems"]["Insert"]>;
      Relationships: [];
      };
      daily_inspirations: {
        Row: { id: string; scheduled_date: string; poem_id: string; created_at: string };
        Insert: { id?: string; scheduled_date: string; poem_id: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["daily_inspirations"]["Insert"]>;
      Relationships: [];
      };
      featured_poets: {
        Row: {
          id: string;
          week_start: string;
          poet_id: string;
          poem_id: string;
          conversation: { q: string; a: string }[];
          created_at: string;
        };
        Insert: {
          id?: string;
          week_start: string;
          poet_id: string;
          poem_id: string;
          conversation?: { q: string; a: string }[];
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["featured_poets"]["Insert"]>;
      Relationships: [];
      };
      follows: {
        Row: { follower_id: string; followee_id: string; created_at: string };
        Insert: { follower_id: string; followee_id: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["follows"]["Insert"]>;
      Relationships: [];
      };
      appreciations: {
        Row: { id: string; poem_id: string; user_id: string; created_at: string };
        Insert: { id?: string; poem_id: string; user_id: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["appreciations"]["Insert"]>;
      Relationships: [];
      };
      app_opens: {
        Row: { id: string; user_id: string; opened_on: string; created_at: string };
        Insert: { id?: string; user_id: string; opened_on?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["app_opens"]["Insert"]>;
      Relationships: [];
      };
      poem_reads: {
        Row: { id: string; user_id: string; poem_id: string; created_at: string };
        Insert: { id?: string; user_id: string; poem_id: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["poem_reads"]["Insert"]>;
      Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          recipient_id: string;
          type: NotificationType;
          actor_id: string | null;
          poem_id: string | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipient_id: string;
          type: NotificationType;
          actor_id?: string | null;
          poem_id?: string | null;
          read_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      Relationships: [];
      };
      user_settings: {
        Row: {
          user_id: string;
          prompt_reminder_enabled: boolean;
          prompt_reminder_frequency: ReminderFrequency;
          streak_reminder_enabled: boolean;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          prompt_reminder_enabled?: boolean;
          prompt_reminder_frequency?: ReminderFrequency;
          streak_reminder_enabled?: boolean;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_settings"]["Insert"]>;
      Relationships: [];
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string;
          poem_id: string | null;
          reported_poet_id: string | null;
          reason: ReportReason;
          created_at: string;
        };
        Insert: {
          id?: string;
          reporter_id: string;
          poem_id?: string | null;
          reported_poet_id?: string | null;
          reason: ReportReason;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reports"]["Insert"]>;
      Relationships: [];
      };
    };
    // Required by @supabase/supabase-js's GenericSchema constraint even
    // though this project has neither — an empty Tables-only schema
    // otherwise silently resolves every row type to `never`.
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
