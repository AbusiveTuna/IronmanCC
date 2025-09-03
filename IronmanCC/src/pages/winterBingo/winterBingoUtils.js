export const coerceMap = (m) => (typeof m === "string" ? JSON.parse(m) : m || {});
export const num = (v, d = 0) => (Number.isFinite(+v) ? +v : d);

export function isComplete(entry, fallbackGoal = 1) {
  if (!entry) return false;
  const goal = Math.max(1, num(entry.goal, fallbackGoal));
  const curr = Math.max(0, num(entry.progress ?? entry.current, 0));
  if (entry.status === "completed") return true;
  return curr >= goal;
}

export function currentOf(entry) {
  return Math.max(0, num(entry?.progress ?? entry?.current, 0));
}

export function progressForTile(tile, aEntry, bEntry) {
  const doneA = isComplete(aEntry, tile.Goal);
  const doneB = isComplete(bEntry, tile.Goal);
  const claimedBy = doneA ? "A" : doneB ? "B" : null;

  const current =
    claimedBy === "A" ? currentOf(aEntry)
    : claimedBy === "B" ? currentOf(bEntry)
    : Math.max(currentOf(aEntry), currentOf(bEntry));

  const goal = Math.max(1, num(aEntry?.goal ?? bEntry?.goal ?? tile.Goal, tile.Goal ?? 1));
  const isPassive = tile.Type === "passive";

  return { claimedBy, current, goal, isPassive };
}
