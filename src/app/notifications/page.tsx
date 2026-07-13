import Link from "next/link";
import { Flame } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getNotifications } from "@/lib/queries/notifications";
import { markAllNotificationsRead } from "@/lib/actions/notifications";
import { formatRelativeOrDate } from "@/lib/format";
import { BackTopAppBar } from "@/components/screens/BackTopAppBar";
import { Avatar } from "@/components/ui/data-display/Avatar";
import { EmptyState } from "@/components/ui/data-display/EmptyState";

export default async function NotificationsPage() {
  const user = await requireUser();
  // Opening this screen is what "reads" the notifications — no per-item
  // mark-as-read affordance, matching the flat, quiet list DESIGN.md wants.
  await markAllNotificationsRead();
  const notifications = await getNotifications(user.id);

  return (
    <div>
      <BackTopAppBar title="Notifications" />
      <div style={{ padding: "4px 8px 24px" }}>
        {notifications.length === 0 && (
          <EmptyState title="Nothing yet" body="Quiet acknowledgements and new followers will show up here." />
        )}
        {notifications.map((n) => {
          if (n.type === "streak_risk") {
            return (
              <div key={n.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 8px" }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "var(--state-warning-subtle)",
                    color: "oklch(40% 0.08 80)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Flame size={16} strokeWidth={1.8} fill="currentColor" />
                </div>
                <div style={{ flex: 1, font: "var(--text-body)", color: "var(--text-primary)" }}>
                  Your streak ends tonight. Open the app again to keep it going.
                </div>
                <span style={{ font: "var(--text-caption)", color: "var(--text-placeholder)", flexShrink: 0 }}>
                  {formatRelativeOrDate(n.createdAt)}
                </span>
              </div>
            );
          }
          if (!n.actor) return null;
          return (
            <Link
              key={n.id}
              href={`/poet/${n.actor.id}`}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 8px", color: "inherit" }}
            >
              <Avatar name={n.actor.name} size={36} src={n.actor.avatarUrl} />
              <div style={{ flex: 1, font: "var(--text-body)", color: "var(--text-primary)" }}>
                <strong style={{ fontWeight: 600 }}>{n.actor.name}</strong>{" "}
                {n.type === "appreciation" ? `sat with your poem "${n.poemTitle}"` : "followed you"}
              </div>
              <span style={{ font: "var(--text-caption)", color: "var(--text-placeholder)", flexShrink: 0 }}>
                {formatRelativeOrDate(n.createdAt)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
