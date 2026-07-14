import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { isAdmin, getReportsForReview } from "@/lib/queries/admin";
import { BackTopAppBar } from "@/components/screens/BackTopAppBar";
import { AdminReportCard } from "@/components/screens/AdminReportCard";
import { EmptyState } from "@/components/ui/data-display/EmptyState";

/** Internal-only, one moderator. App-side gating here is just UX — the RLS
 * policies on reports (reports_select_admin) and the admin_* RPCs are what
 * actually enforce this; a non-admin hitting this URL directly would see
 * an empty list (RLS) even without this redirect. */
export default async function AdminReportsPage() {
  const user = await requireUser();
  if (!(await isAdmin(user.id))) redirect("/profile");

  const reports = await getReportsForReview();

  return (
    <div style={{ padding: "16px 16px 24px" }}>
      <BackTopAppBar title="Reports" style={{ padding: "0 0 14px" }} />
      {reports.length === 0 ? (
        <EmptyState title="No reports" body="Nothing has been reported yet." />
      ) : (
        reports.map((r) => <AdminReportCard key={r.id} report={r} />)
      )}
    </div>
  );
}
