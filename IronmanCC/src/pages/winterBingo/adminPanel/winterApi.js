const API_BASE = "https://api.ironmancc.com/ironmancc";

export const getProgress = async (competitionId, teamName) => {
  const res = await fetch(`${API_BASE}/progress/${competitionId}?team=${encodeURIComponent(teamName)}`);
  if (!res.ok) return null;
  return res.json();
};

export const saveProgress = async ({ competitionId, teamName, tiles, pointsTotal }) => {
  const res = await fetch(`${API_BASE}/progress-save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ competitionId, teamName, tiles, pointsTotal }),
  });
  if (!res.ok) throw new Error("Save failed");
  return res.json();
};
