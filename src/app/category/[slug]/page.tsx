import { notFound } from "next/navigation";
import { getCategoryBySlug, getCategoryPrompts } from "@/lib/queries/prompts";
import { BackTopAppBar } from "@/components/screens/BackTopAppBar";
import { CategoryPromptGenerator } from "@/components/screens/CategoryPromptGenerator";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const prompts = await getCategoryPrompts(category.id);

  return (
    <div>
      <BackTopAppBar title={`${category.label} prompts`} />
      <div style={{ padding: "4px 16px 24px" }}>
        <CategoryPromptGenerator prompts={prompts} />
      </div>
    </div>
  );
}
