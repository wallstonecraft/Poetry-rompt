import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getDraftForEditing } from "@/lib/queries/poems";
import { getTodaysPrompt } from "@/lib/queries/prompts";
import { WriteScreenClient } from "@/components/screens/WriteScreenClient";

export default async function WritePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const poem = await getDraftForEditing(id);

  // RLS lets anyone read a *published* poem by id, but the write screen is
  // only ever valid for your own, still-private draft — checked explicitly
  // here rather than trusted from the SELECT succeeding.
  if (!poem || poem.author?.id !== user.id || poem.status !== "draft") notFound();

  const promptText = poem.promptText ?? (await getTodaysPrompt())?.text ?? "";

  return (
    <WriteScreenClient
      poemId={id}
      initialTitle={poem.title}
      initialContent={poem.content}
      promptText={promptText}
      competitionTitle={poem.competitionTitle}
    />
  );
}
