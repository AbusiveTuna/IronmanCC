export const ROWS = 10;
export const COLS = 10;

export const num = (v, d = 0) => (Number.isFinite(+v) ? +v : d);
export const coerceMap = (m) => (typeof m === "string" ? JSON.parse(m) : m || {});

export const isComplete = (entry, fallbackGoal = 1) => {
  if (!entry) return false;
  const goal = Math.max(1, num(entry.goal, fallbackGoal));
  const curr = Math.max(0, num(entry.progress ?? entry.current, 0));
  if (entry.status === "completed") return true;
  return curr >= goal;
};

export const withEntry = (map, t) => {
  const e = map[t.Id] || {};
  const goal = Math.max(1, num(e.goal ?? t.Goal ?? 1, 1));
  const progress = Math.max(0, num(e.progress ?? e.current, 0));
  const status = progress >= goal ? "completed" : (e.status ?? "in_progress");
  return { goal, progress, status };
};

export const computePoints = (map, tiles) => {
  let pts = 0;
  for (const t of tiles) {
    const e = map[t.Id];
    if (!e) continue;
    if (isComplete(e, t.Goal)) pts += t.Type === "pet-passive" ? 2 : 1;
  }
  return pts;
};

export const chunkRows = (list, cols) =>
  Array.from({ length: Math.ceil(list.length / cols) }, (_, r) =>
    list.slice(r * cols, (r + 1) * cols)
  );
