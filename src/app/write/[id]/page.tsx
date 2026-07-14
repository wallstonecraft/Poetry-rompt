import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getDraftForEditing } from "@/lib/queries/poems";
import { WriteScreenClient } from "@/components/screens/WriteScreenClient";

export default async function WritePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const poem = await getDraftForEditing(id);

  // RLS lets anyone read a *published* poem by id, but the write screen is
  // only ever valid for your own, still-private draft — checked explicitly
  // here rather than trusted from the SELECT succeeding.
  if (!poem || poem.author?.id !== user.id || poem.status !== "draft") notFound();

  // No fallback to today's prompt: a poem with no prompt_id/competition_id
  // is freeform ("Just write") and the writing screen omits the PROMPT
  // block entirely for it — it is not the same as "no prompt was passed in,
  // so show today's as a default."
  return (
    <WriteScreenClient
      poemId={id}
      initialTitle={poem.title}
      initialContent={poem.content}
      promptText={poem.promptText}
      competitionTitle={poem.competitionTitle}
    />
  );
}
