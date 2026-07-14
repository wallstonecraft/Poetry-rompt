import { requireUser } from "@/lib/auth";
import { getActiveFragments } from "@/lib/queries/fragments";
import { BackTopAppBar } from "@/components/screens/BackTopAppBar";
import { FragmentCapture } from "@/components/screens/FragmentCapture";
import { FragmentCard } from "@/components/screens/FragmentCard";
import { EmptyState } from "@/components/ui/data-display/EmptyState";

export default async function FragmentsPage() {
  const user = await requireUser();
  const fragments = await getActiveFragments(user.id);

  return (
    <div style={{ padding: "16px 16px 24px" }}>
      <BackTopAppBar title="Fragments" style={{ padding: "0 0 14px" }} />
      <FragmentCapture />
      <div style={{ marginTop: 20 }}>
        {fragments.length === 0 ? (
          <EmptyState title="Nothing captured yet" body="Jot a line whenever one shows up." />
        ) : (
          fragments.map((f) => <FragmentCard key={f.id} fragment={f} />)
        )}
      </div>
    </div>
  );
}
