import { useEffect, useMemo, useState } from "react";
import "./WinterBingoAdmin.css";
import Tile from "components/bingo/tiles/Tile";
import tiles from "../tiles.json";

const API_BASE = "https://api.ironmancc.com/ironmancc";
const GET_URL = (competitionId, team) =>
  `${API_BASE}/progress/${competitionId}?team=${encodeURIComponent(team)}`;
const SAVE_URL = `${API_BASE}/progress-save`;

const ROWS = 10;
const COLS = 10;

const num = (v, d = 0) => (Number.isFinite(+v) ? +v : d);
const coerceMap = (m) => (typeof m === "string" ? JSON.parse(m) : m || {});
const isComplete = (entry, fallbackGoal = 1) => {
  if (!entry) return false;
  const goal = Math.max(1, num(entry.goal, fallbackGoal));
  const curr = Math.max(0, num(entry.progress ?? entry.current, 0));
  if (entry.status === "completed") return true;
  return curr >= goal;
};
const withEntry = (map, t) => {
  const e = map[t.Id] || {};
  const goal = Math.max(1, num(e.goal ?? t.Goal ?? 1, 1));
  const progress = Math.max(0, num(e.progress ?? e.current, 0));
  const status = progress >= goal ? "completed" : (e.status ?? "in_progress");
  return { goal, progress, status };
};

const computePoints = (map) => {
  let pts = 0;
  for (const t of tiles) {
    const e = map[t.Id];
    if (!e) continue;
    if (isComplete(e, t.Goal)) {
      pts += t.Type === "pet-passive" ? 2 : 1;
    }
  }
  return pts;
};

const WinterBingoAdmin = ({
  competitionId = 111,
  teamAName = "Team Lukas",
  teamBName = "Team Bonsai",
}) => {
  const [teamA, setTeamA] = useState(null);
  const [teamB, setTeamB] = useState(null);
  const [editing, setEditing] = useState("A"); // "A" | "B"
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const petTiles = useMemo(() => tiles.filter((t) => t.Type === "pet-passive"), []);
  const gridTiles = useMemo(() => tiles.filter((t) => t.Type !== "pet-passive"), []);
  const rows = useMemo(
    () => Array.from({ length: ROWS }, (_, r) => gridTiles.slice(r * COLS, (r + 1) * COLS)),
    [gridTiles]
  );

  useEffect(() => {
    let dead = false;
    (async () => {
      try {
        const [aRes, bRes] = await Promise.all([
          fetch(GET_URL(competitionId, teamAName)),
          fetch(GET_URL(competitionId, teamBName)),
        ]);
        const a = aRes.ok ? await aRes.json() : null;
        const b = bRes.ok ? await bRes.json() : null;
        if (!dead) {
          setTeamA(a);
          setTeamB(b);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!dead) setLoading(false);
      }
    })();
    return () => { dead = true; };
  }, [competitionId, teamAName, teamBName]);

  const mapA = useMemo(() => coerceMap(teamA?.tiles), [teamA]);
  const mapB = useMemo(() => coerceMap(teamB?.tiles), [teamB]);

  const claimedBy = useMemo(() => {
    const m = {};
    for (const t of tiles) {
      const aDone = isComplete(mapA[t.Id], t.Goal);
      const bDone = isComplete(mapB[t.Id], t.Goal);
      m[t.Id] = aDone ? "A" : bDone ? "B" : null;
    }
    return m;
  }, [mapA, mapB]);

  const setMap = (team, updater) => {
    if (team === "A") setTeamA((s) => ({ ...s, tiles: updater(coerceMap(s?.tiles)) }));
    else setTeamB((s) => ({ ...s, tiles: updater(coerceMap(s?.tiles)) }));
  };

  const updateTile = (team, t, nextProgress) => {
    const other = team === "A" ? "B" : "A";
    const thisMap = team === "A" ? mapA : mapB;
    const otherMap = other === "A" ? mapA : mapB;
    const { goal } = withEntry(thisMap, t);
    const progress = Math.max(0, Math.min(goal, nextProgress));
    const status = progress >= goal ? "completed" : "in_progress";

    setMap(team, (m) => {
      const copy = { ...m, [t.Id]: { ...m[t.Id], progress, goal, status } };
      return copy;
    });

    // Enforce exclusivity: if this team completes, clear the other team's completion
    const completes = progress >= goal;
    if (completes && isComplete(otherMap[t.Id], t.Goal)) {
      setMap(other, (m) => {
        const e = withEntry(m, t);
        return { ...m, [t.Id]: { ...m[t.Id], progress: Math.min(e.progress, e.goal - 1), goal: e.goal, status: "in_progress" } };
      });
    }
  };

  const handleClick = (t) => {
    const activeMap = editing === "A" ? mapA : mapB;
    const { progress, goal } = withEntry(activeMap, t);
    updateTile(editing, t, progress + 1);
  };

  const handleRightClick = (e, t) => {
    e.preventDefault();
    const activeMap = editing === "A" ? mapA : mapB;
    const { progress } = withEntry(activeMap, t);
    updateTile(editing, t, progress - 1);
  };

  const pointsA = useMemo(() => computePoints(mapA), [mapA]);
  const pointsB = useMemo(() => computePoints(mapB), [mapB]);

  const saveTeam = async (team) => {
    const rec = team === "A" ? teamA : teamB;
    const name = team === "A" ? teamAName : teamBName;
    const tilesMap = team === "A" ? mapA : mapB;
    const points = team === "A" ? pointsA : pointsB;
    setSaving(true);
    try {
      await fetch(SAVE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          competitionId,
          teamName: name,
          tiles: tilesMap,
          pointsTotal: points,
        }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const saveBoth = async () => {
    setSaving(true);
    try {
      await Promise.all([saveTeam("A"), saveTeam("B")]);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="WinterBingoAdmin-root">
        <header className="WinterBingoAdmin-bar">
          <h2>Admin · BONSAI × LUKAS Winter Special</h2>
        </header>
        <div className="WinterBingoAdmin-loading" />
      </section>
    );
  }

  return (
    <section className="WinterBingoAdmin-root">
      <header className="WinterBingoAdmin-bar">
        <h2>Admin · BONSAI × LUKAS Winter Special</h2>

        <div className="WinterBingoAdmin-controls">
          <div className="WinterBingoAdmin-editing">
            <span>Editing:</span>
            <button
              className={editing === "A" ? "is-active fbA" : "fbA"}
              onClick={() => setEditing("A")}
              type="button"
            >
              {teamAName}
            </button>
            <button
              className={editing === "B" ? "is-active fbB" : "fbB"}
              onClick={() => setEditing("B")}
              type="button"
            >
              {teamBName}
            </button>
          </div>

          <div className="WinterBingoAdmin-points">
            <span className="dot fbA" /> {teamAName}: <b>{pointsA}</b>
            <span className="dot fbB" /> {teamBName}: <b>{pointsB}</b>
          </div>

          <div className="WinterBingoAdmin-actions">
            <button type="button" onClick={() => saveTeam("A")} disabled={saving}>Save {teamAName}</button>
            <button type="button" onClick={() => saveTeam("B")} disabled={saving}>Save {teamBName}</button>
            <button type="button" onClick={saveBoth} disabled={saving}>Save Both</button>
          </div>
        </div>
      </header>

      {!!petTiles.length && (
        <div className="WinterBingoAdmin-pets">
          {petTiles.map((t) => {
            const aDone = isComplete(mapA[t.Id], t.Goal);
            const bDone = isComplete(mapB[t.Id], t.Goal);
            const claimed = aDone ? "A" : bDone ? "B" : null;
            const showMap = editing === "A" ? mapA : mapB;
            const { progress, goal } = withEntry(showMap, t);

            return (
              <div
                key={t.Id}
                className={[
                  "WinterBingoAdmin-cell",
                  claimed === "A" ? "is-claimed-A" : "",
                  claimed === "B" ? "is-claimed-B" : "",
                ].join(" ")}
                onClick={() => handleClick(t)}
                onContextMenu={(e) => handleRightClick(e, t)}
                title="Click +1, Right-click -1"
              >
                <Tile
                  image={t.Image}
                  name={t.Name}
                  description={t.Description}
                  longDescription={t.LongDescription}
                  tileProgress={progress}
                  tileGoal={goal}
                />
                <div className="WinterBingoAdmin-mini">
                  {editing} {progress}/{goal}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div
        className="WinterBingoAdmin-grid"
        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
      >
        {rows.flat().map((t) => {
          if (!t) return null;
          const aDone = isComplete(mapA[t.Id], t.Goal);
          const bDone = isComplete(mapB[t.Id], t.Goal);
          const claimed = aDone ? "A" : bDone ? "B" : null;
          const showMap = editing === "A" ? mapA : mapB;
          const { progress, goal } = withEntry(showMap, t);
          const isPassive = t.Type === "passive";

          return (
            <div
              key={t.Id}
              className={[
                "WinterBingoAdmin-cell",
                isPassive ? "is-passive" : "",
                claimed === "A" ? "is-claimed-A" : "",
                claimed === "B" ? "is-claimed-B" : "",
              ].join(" ")}
              onClick={() => handleClick(t)}
              onContextMenu={(e) => handleRightClick(e, t)}
              title="Click +1, Right-click -1"
            >
              {isPassive && <div className="WinterBingoAdmin-badge">Passive</div>}
              <Tile
                image={t.Image}
                name={t.Name}
                description={t.Description}
                longDescription={t.LongDescription}
                tileProgress={progress}
                tileGoal={goal}
              />
              <div className="WinterBingoAdmin-mini">
                {editing} {progress}/{goal}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WinterBingoAdmin;
