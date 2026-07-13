"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Bookmark, User, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { BottomTabBar } from "@/components/ui/navigation/BottomTabBar";
import { FAB } from "@/components/ui/navigation/FAB";

const TABS = [
  { value: "home", label: "Home", path: "/home", icon: <Home size={20} strokeWidth={1.8} /> },
  { value: "feed", label: "Feed", path: "/feed", icon: <Bookmark size={20} strokeWidth={1.8} /> },
  { value: "profile", label: "Profile", path: "/profile", icon: <User size={20} strokeWidth={1.8} /> },
];

export function TabShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const active = TABS.find((t) => pathname.startsWith(t.path))?.value ?? "home";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-app)" }}>
      <div style={{ flex: 1, paddingBottom: 96 }}>{children}</div>
      <div style={{ position: "fixed", right: 16, bottom: 82, zIndex: 40 }}>
        <FAB onClick={() => router.push("/write/new")} style={{ width: 48, height: 48 }}>
          <Plus size={22} strokeWidth={2.2} />
        </FAB>
      </div>
      <BottomTabBar
        value={active}
        onChange={(v) => {
          const tab = TABS.find((t) => t.value === v);
          if (tab) router.push(tab.path);
        }}
        items={TABS.map(({ value, label, icon }) => ({ value, label, icon }))}
        style={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      />
    </div>
  );
}
