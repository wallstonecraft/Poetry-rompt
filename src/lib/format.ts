export function formatRelativeOrDate(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  const diffHours = (Date.now() - date.getTime()) / 3_600_000;
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${Math.floor(diffHours)}h ago`;
  if (diffHours < 48) return "1d ago";
  if (diffHours < 24 * 7) return `${Math.floor(diffHours / 24)}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function formatDeadline(iso: string): string {
  return `Closes ${new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
}
