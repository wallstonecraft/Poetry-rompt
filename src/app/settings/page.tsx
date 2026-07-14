import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getSettings } from "@/lib/queries/profile";
import { isAdmin } from "@/lib/queries/admin";
import { BackTopAppBar } from "@/components/screens/BackTopAppBar";
import { SettingsForm } from "@/components/screens/SettingsForm";
import { LogoutButton } from "@/components/screens/LogoutButton";
import { DeleteAccountFlow } from "@/components/screens/DeleteAccountFlow";

export default async function SettingsPage() {
  const user = await requireUser();
  const [settings, admin] = await Promise.all([getSettings(user.id), isAdmin(user.id)]);

  return (
    <div style={{ padding: "16px 16px 24px" }}>
      <BackTopAppBar title="Settings" style={{ padding: "0 0 14px" }} />
      <SettingsForm
        initialPromptReminderEnabled={settings?.promptReminderEnabled ?? true}
        initialFrequency={settings?.promptReminderFrequency ?? "daily"}
        initialStreakReminderEnabled={settings?.streakReminderEnabled ?? true}
      />
      {admin && (
        <Link
          href="/admin/reports"
          style={{ display: "block", margin: "16px 0", font: "var(--text-caption-medium)", color: "var(--green-700)" }}
        >
          Reports (admin)
        </Link>
      )}
      <LogoutButton />
      <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid var(--border-hairline)" }}>
        <DeleteAccountFlow />
      </div>
    </div>
  );
}
