"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/data-display/Card";
import { Switch } from "@/components/ui/forms/Switch";
import { Radio } from "@/components/ui/forms/Radio";
import { updateSettings } from "@/lib/actions/settings";
import type { ReminderFrequency } from "@/lib/supabase/database.types";

export function SettingsForm({
  initialPromptReminderEnabled,
  initialFrequency,
  initialStreakReminderEnabled,
}: {
  initialPromptReminderEnabled: boolean;
  initialFrequency: ReminderFrequency;
  initialStreakReminderEnabled: boolean;
}) {
  const [remind, setRemind] = useState(initialPromptReminderEnabled);
  const [freq, setFreq] = useState<ReminderFrequency>(initialFrequency);
  const [streakNudge, setStreakNudge] = useState(initialStreakReminderEnabled);
  const [, startTransition] = useTransition();

  return (
    <>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: remind ? 16 : 0 }}>
          <div style={{ font: "var(--text-body-medium)" }}>Daily prompt reminder</div>
          <Switch
            checked={remind}
            onChange={(next) => {
              setRemind(next);
              startTransition(() => void updateSettings({ promptReminderEnabled: next }));
            }}
          />
        </div>
        {remind && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 14, borderTop: "1px solid var(--border-hairline)" }}>
            <Radio
              label="Every morning"
              checked={freq === "daily"}
              onChange={() => {
                setFreq("daily");
                startTransition(() => void updateSettings({ promptReminderFrequency: "daily" }));
              }}
            />
            <Radio
              label="Once a week"
              checked={freq === "weekly"}
              onChange={() => {
                setFreq("weekly");
                startTransition(() => void updateSettings({ promptReminderFrequency: "weekly" }));
              }}
            />
          </div>
        )}
      </Card>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ font: "var(--text-body-medium)", marginBottom: 4 }}>Streak reminder</div>
            <div style={{ font: "var(--text-caption)", color: "var(--text-secondary)" }}>
              One quiet nudge in the evening, only on days you haven&apos;t opened the app.
            </div>
          </div>
          <Switch
            checked={streakNudge}
            onChange={(next) => {
              setStreakNudge(next);
              startTransition(() => void updateSettings({ streakReminderEnabled: next }));
            }}
          />
        </div>
      </Card>
    </>
  );
}
