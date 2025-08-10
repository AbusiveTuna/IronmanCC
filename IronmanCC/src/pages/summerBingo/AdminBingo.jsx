import React, { useEffect, useMemo, useState, useCallback } from "react";
import "./admin.css";
import tiles from "./tiles.json";

const API_BASE = "https://api.ironmancc.com/ironmancc";
const DRAFT_GET_URL = (id) => `${API_BASE}/draft/${id}`;
const PROGRESS_GET_URL = (id, team) =>
  `${API_BASE}/progress/${id}?team=${encodeURIComponent(team)}`;
const PROGRESS_SAVE_URL = `${API_BASE}/progress-save`;
const COMPETITION_ID = 1;

function normalizeTeamNames(teamsJson) {
  if (!teamsJson) return ["Team A", "Team B"];
  if (teamsJson.teamOne || teamsJson.teamTwo) {
    const a = teamsJson.teamOne?.name || "Team A";
    const b = teamsJson.teamTwo?.name || "Team B";
    return [a, b];
  }
  const keys = Object.keys(teamsJson);
  if (keys.length >= 2) return [keys[0], keys[1]];
  return ["Team A", "Team B"];
}

function statusFrom(progress, goal) {
  if ((progress ?? 0) <= 0) return "not_started";
  if ((progress ?? 0) >= (goal ?? 1)) return "completed";
  return "in_progress";
}

function buildInitialMap(allTiles, existing = {}) {
  const map = {};
  for (const t of allTiles) {
    const id = String(t.Id);
    const goal = Number.isFinite(t.Goal) ? t.Goal : 1;
    const prev = existing[id] || {};
    const progress = Number.isFinite(prev.progress) ? prev.progress : 0;
    const st = prev.status || statusFrom(progress, goal);
    map[id] = { status: st, progress, goal, points: 5 };
  }
  return map;
}

function completedCount(map) {
  return Object.values(map || {}).filter(
    (s) => (s?.progress ?? 0) >= (s?.goal ?? 1)
  ).length;
}

const AdminBingo = () => {
  const allTiles = useMemo(() => tiles.slice(0, 25), []);
  const [teamNames, setTeamNames] = useState(["Team A", "Team B"]);
  const [maps, setMaps] = useState({}); // { [teamName]: { [tileId]: {status,progress,goal,points} } }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({}); // { [teamName]: bool }

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        // get team names
        let names = ["Team A", "Team B"];
        const draftRes = await fetch(DRAFT_GET_URL(COMPETITION_ID));
        if (draftRes.ok) {
          const draftData = await draftRes.json();
          names = normalizeTeamNames(draftData?.teams);
        }
        if (!active) return;
        setTeamNames(names);

        // get progress per team
        const [aRes, bRes] = await Promise.all([
          fetch(PROGRESS_GET_URL(COMPETITION_ID, names[0])),
          fetch(PROGRESS_GET_URL(COMPETITION_ID, names[1])),
        ]);

        const next = {};
        if (aRes.ok) {
          const a = await aRes.json();
          next[names[0]] = buildInitialMap(allTiles, a?.tiles);
        } else {
          next[names[0]] = buildInitialMap(allTiles, {});
        }
        if (bRes.ok) {
          const b = await bRes.json();
          next[names[1]] = buildInitialMap(allTiles, b?.tiles);
        } else {
          next[names[1]] = buildInitialMap(allTiles, {});
        }

        if (!active) return;
        setMaps(next);
      } catch (e) {
        if (!active) return;
        const fallback = {};
        fallback["Team A"] = buildInitialMap(allTiles, {});
        fallback["Team B"] = buildInitialMap(allTiles, {});
        setMaps(fallback);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [allTiles]);

  const updateProgress = useCallback((team, tileId, newVal) => {
    setMaps((prev) => {
      const m = { ...prev[team] };
      const entry = { ...(m[tileId] || {}) };
      const goal = entry.goal ?? 1;
      const progress = Math.max(0, Math.min(Number.isFinite(newVal) ? newVal : 0, goal));
      entry.progress = progress;
      entry.status = statusFrom(progress, goal);
      entry.points = 5;
      m[tileId] = entry;
      return { ...prev, [team]: m };
    });
  }, []);

  const setComplete = useCallback((team, tileId) => {
    setMaps((prev) => {
      const m = { ...prev[team] };
      const entry = { ...(m[tileId] || {}) };
      const goal = entry.goal ?? 1;
      entry.progress = goal;
      entry.status = "completed";
      entry.points = 5;
      m[tileId] = entry;
      return { ...prev, [team]: m };
    });
  }, []);

  const setZero = useCallback((team, tileId) => {
    setMaps((prev) => {
      const m = { ...prev[team] };
      const entry = { ...(m[tileId] || {}) };
      entry.progress = 0;
      entry.status = "not_started";
      entry.points = 5;
      m[tileId] = entry;
      return { ...prev, [team]: m };
    });
  }, []);

  const saveTeam = useCallback(async (team) => {
    try {
      setSaving((s) => ({ ...s, [team]: true }));
      const tilesMap = maps[team] || {};
      const pointsTotal = completedCount(tilesMap) * 5;
      const res = await fetch(PROGRESS_SAVE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          competitionId: COMPETITION_ID,
          teamName: team,
          tiles: tilesMap,
          pointsTotal,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // ok
    } catch (e) {
      console.error("Save failed for", team, e);
    } finally {
      setSaving((s) => ({ ...s, [team]: false }));
    }
  }, [maps]);

  const saveAll = useCallback(async () => {
    for (const t of teamNames) {
      // eslint-disable-next-line no-await-in-loop
      await saveTeam(t);
    }
  }, [saveTeam, teamNames]);

  if (loading) return <div className="admin-wrap">Loading…</div>;

  return (
    <div className="admin-wrap">
      <div className="admin-header">
        <h1>Admin — Bingo Progress</h1>
        <button className="a-btn a-primary" onClick={saveAll}>Save All</button>
      </div>

      <div className="admin-grids">
        {teamNames.map((team) => {
          const map = maps[team] || {};
          const pts = completedCount(map) * 5;
          return (
            <section key={team} className="admin-panel">
              <header className="admin-teamHeader">
                <h2>{team}</h2>
                <div className="admin-points">{pts} pts</div>
                <button
                  className="a-btn a-primary"
                  onClick={() => saveTeam(team)}
                  disabled={!!saving[team]}
                >
                  {saving[team] ? "Saving…" : "Save Team"}
                </button>
              </header>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Tile</th>
                    <th>Goal</th>
                    <th>Progress</th>
                    <th>Status</th>
                    <th>Quick</th>
                  </tr>
                </thead>
                <tbody>
                  {allTiles.map((t) => {
                    const id = String(t.Id);
                    const entry = map[id] || { goal: t.Goal ?? 1, progress: 0, status: "not_started" };
                    return (
                      <tr key={id}>
                        <td className="tile-cell">
                          <img src={t.Image} alt="" className="tile-icon" />
                          <div className="tile-text">
                            <div className="tile-title">{t.Name}</div>
                            <div className="tile-sub">{t.Description}</div>
                          </div>
                        </td>
                        <td className="num">{entry.goal ?? 1}</td>
                        <td className="progress-cell">
                          <input
                            type="number"
                            min={0}
                            max={entry.goal ?? 1}
                            value={entry.progress ?? 0}
                            onChange={(e) => updateProgress(team, id, parseInt(e.target.value, 10))}
                          />
                          <span className="slash">/</span>
                          <span>{entry.goal ?? 1}</span>
                        </td>
                        <td>
                          <span className={`pill ${entry.status}`}>
                            {entry.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="quick">
                          <button className="a-btn" onClick={() => setZero(team, id)}>0</button>
                          <button className="a-btn" onClick={() => setComplete(team, id)}>✓</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default AdminBingo;
