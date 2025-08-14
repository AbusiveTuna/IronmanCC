import { useMemo, useEffect, useState } from "react";
import "./SummerBingo.css";
import tiles from "./tiles.json";
import Board from "./components/Board";

const API_BASE = "https://api.ironmancc.com/ironmancc";
const DRAFT_GET_URL = (id) => `${API_BASE}/draft/${id}`;
const PROGRESS_GET_URL = (id, team) =>
  `${API_BASE}/progress/${id}?team=${encodeURIComponent(team)}`;
const COMPETITION_ID = 101;

function completedCount(map) {
  return Object.values(map || {}).filter(
    (s) => s?.status === "completed" || (s?.progress ?? 0) >= (s?.goal ?? 1)
  ).length;
}

function completedActiveCount(map, activeIds) {
  const ids = new Set(activeIds);
  return Object.entries(map || {}).filter(([id, s]) => {
    if (!ids.has(id)) return false;
    const goal = s?.goal ?? 1;
    const prog = s?.progress ?? 0;
    return s?.status === "completed" || prog >= goal;
  }).length;
}

// Start with 5 active + 1 passive. +5 active +1 passive per 3 active completions.
// Caps: 40 active, 5 passive.
function unlockedCounts(activeCompleted) {
  const groups = Math.max(1, 1 + Math.floor(activeCompleted / 3));
  return {
    active: Math.min(groups * 5, 40),
    passive: Math.min(groups, 5),
  };
}

const SummerBingo = () => {
  const activeAll = useMemo(() => tiles.filter(t => !t.Passive).slice(0, 40), []);
  const passiveAll = useMemo(() => tiles.filter(t => t.Passive).slice(0, 5), []);
  const activeIds = useMemo(() => activeAll.map(t => String(t.Id)), [activeAll]);

  const [teamNames, setTeamNames] = useState(["Team A", "Team B"]);
  const [statusA, setStatusA] = useState({});
  const [statusB, setStatusB] = useState({});
  const [pointsA, setPointsA] = useState(0);
  const [pointsB, setPointsB] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const draftRes = await fetch(DRAFT_GET_URL(COMPETITION_ID));
        let names = ["Team A", "Team B"];
        if (draftRes.ok) {
          const d = await draftRes.json();
          names = (d.teamOne || d.teamTwo)
            ? [d.teamOne?.name || "Team A", d.teamTwo?.name || "Team B"]
            : Object.keys(d.teams || {});
        }
        if (!active) return;
        setTeamNames(names.slice(0, 2));

        const [pa, pb] = await Promise.all([
          fetch(PROGRESS_GET_URL(COMPETITION_ID, names[0])),
          fetch(PROGRESS_GET_URL(COMPETITION_ID, names[1])),
        ]);

        let A = {}, B = {}, pA = 0, pB = 0;
        if (pa.ok) {
          const a = await pa.json();
          A = a.tiles || a.teams?.[names[0]]?.tiles || {};
          pA = a.points_total ?? completedCount(A) * 5;
        }
        if (pb.ok) {
          const b = await pb.json();
          B = b.tiles || b.teams?.[names[1]]?.tiles || {};
          pB = b.points_total ?? completedCount(B) * 5;
        }
        if (!active) return;
        setStatusA(A); setStatusB(B); setPointsA(pA); setPointsB(pB);
      } catch {
        if (!active) return;
        setStatusA({}); setStatusB({}); setPointsA(0); setPointsB(0);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  // Team A unlocks
  const doneA = completedActiveCount(statusA, activeIds);
  const { active: activeUnlockedA, passive: passiveUnlockedA } = unlockedCounts(doneA);
  const activeTilesA = activeAll.slice(0, activeUnlockedA);
  const passiveTilesA = passiveAll.slice(0, passiveUnlockedA);

  // Team B unlocks
  const doneB = completedActiveCount(statusB, activeIds);
  const { active: activeUnlockedB, passive: passiveUnlockedB } = unlockedCounts(doneB);
  const activeTilesB = activeAll.slice(0, activeUnlockedB);
  const passiveTilesB = passiveAll.slice(0, passiveUnlockedB);

  if (loading) {
    return (
      <div className="sb-wrap">
        <div className="sb-boards">
          {[0,1].map(i => (
            <section key={i} className="sb-team">
              <header className="sb-header">
                <h2>{teamNames[i]}</h2>
                <div className="sb-points">…</div>
              </header>
              <div className="sb-passivesRow">
                <div className="summerBingo-board" style={{ "--tile-max": "110px", gridTemplateColumns: "repeat(3, minmax(0, var(--tile-max)))" }}>
                  {Array.from({ length: 3 }).map((_, k) => <div key={k} className="summerBingo-tile skeleton" />)}
                </div>
              </div>
              <div className="sb-main">
                <div className="summerBingo-board" style={{ "--tile-max": "140px", gridTemplateColumns: "repeat(5, minmax(0, var(--tile-max)))" }}>
                  {Array.from({ length: 10 }).map((_, k) => <div key={k} className="summerBingo-tile skeleton" />)}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="sb-wrap">
      <div className="sb-boards">
        {/* Team A */}
        <section className="sb-team">
          <header className="sb-header">
            <h2>{teamNames[0]}</h2>
            <div className="sb-points">{pointsA} pts</div>
          </header>

          {passiveTilesA.length > 0 && (
            <div className="sb-passivesRow">
              <Board
                tiles={passiveTilesA}
                statusMap={statusA}
                visibleRows={999}
                style={{ "--tile-max": "140px" }}
                showDesc={false}
                cols={Math.max(1, passiveTilesA.length)}  // single row
              />
            </div>
          )}

          <div className="sb-main">
            <Board
              tiles={activeTilesA}
              statusMap={statusA}
              visibleRows={999}
              style={{ "--tile-max": "140px" }}
              showDesc={false}
              cols={5}
            />
          </div>
        </section>

        {/* Team B */}
        <section className="sb-team">
          <header className="sb-header">
            <h2>{teamNames[1]}</h2>
            <div className="sb-points">{pointsB} pts</div>
          </header>

          {passiveTilesB.length > 0 && (
            <div className="sb-passivesRow">
              <Board
                tiles={passiveTilesB}
                statusMap={statusB}
                visibleRows={999}
                style={{ "--tile-max": "140px" }}
                showDesc={false}
                cols={Math.max(1, passiveTilesB.length)}  // single row
              />
            </div>
          )}

          <div className="sb-main">
            <Board
              tiles={activeTilesB}
              statusMap={statusB}
              visibleRows={999}
              style={{ "--tile-max": "140px" }}
              showDesc={false}
              cols={5}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default SummerBingo;
