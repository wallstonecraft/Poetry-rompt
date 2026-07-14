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

/** Quiet, approximate — About You's "time spent writing" is a practice
 * record, not a stopwatch, so this rounds to the nearest minute and drops
 * to "Less than a minute" rather than showing 0m. */
export function formatDuration(totalSeconds: number): string {
  const minutes = Math.round(totalSeconds / 60);
  if (minutes < 1) return "Less than a minute";
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) return `${remainingMinutes}m`;
  return `${hours}h ${remainingMinutes}m`;
}
