import { requireUser } from "@/lib/auth";
import { getSettings } from "@/lib/queries/profile";
import { BackTopAppBar } from "@/components/screens/BackTopAppBar";
import { SettingsForm } from "@/components/screens/SettingsForm";
import { LogoutButton } from "@/components/screens/LogoutButton";

export default async function SettingsPage() {
  const user = await requireUser();
  const settings = await getSettings(user.id);

  return (
    <div style={{ padding: "16px 16px 24px" }}>
      <BackTopAppBar title="Settings" style={{ padding: "0 0 14px" }} />
      <SettingsForm
        initialPromptReminderEnabled={settings?.promptReminderEnabled ?? true}
        initialFrequency={settings?.promptReminderFrequency ?? "daily"}
        initialStreakReminderEnabled={settings?.streakReminderEnabled ?? true}
      />
      <LogoutButton />
    </div>
  );
}
