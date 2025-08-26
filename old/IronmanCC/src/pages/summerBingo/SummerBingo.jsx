import { useMemo, useEffect, useState } from "react";
import "./SummerBingo.css";
import tiles from "./tiles.json";
import Board from "./components/Board";

const API_BASE = "https://api.ironmancc.com/ironmancc";
const PROGRESS_GET_URL = (id, team) =>
  `${API_BASE}/progress/${id}?team=${encodeURIComponent(team)}`;
const COMPETITION_ID = 101;

function completedCount(map, ids) {
  const allow = ids ? new Set(ids.map(String)) : null;
  return Object.entries(map || {}).filter(([id, s]) => {
    if (allow && !allow.has(id)) return false;
    const goal = s?.goal ?? 1;
    const prog = s?.progress ?? 0;
    return s?.status === "completed" || prog >= goal;
  }).length;
}

function unlockedCounts(totalCompleted) {
  const groups = Math.max(1, 1 + Math.floor(totalCompleted / 3));
  const baseActive = Math.min(groups * 5, 40);
  let bonus = 0;
  if (totalCompleted >= 36) bonus = 15;
  else if (totalCompleted >= 33) bonus = 10;
  else if (totalCompleted >= 30) bonus = 5;
  return {
    active: Math.min(baseActive + bonus, 55),
    passive: Math.min(groups, 5),
  };
}

function isDone(statusMap, tile) {
  const s = statusMap[tile.Id];
  const goal = s?.goal ?? tile.Goal ?? 1;
  const prog = s?.progress ?? 0;
  return s?.status === "completed" || prog >= goal;
}

const SummerBingo = () => {
  const activeAll = useMemo(() => tiles.filter(t => !t.Passive).slice(0, 55), []);
  const passiveAll = useMemo(() => tiles.filter(t => t.Passive).slice(0, 5), []);
  const activeIds  = useMemo(() => activeAll.map(t => String(t.Id)), [activeAll]);
  const passiveIds = useMemo(() => passiveAll.map(t => String(t.Id)), [passiveAll]);

  const [teamNames] = useState(["Team Tuna", "Team Chkn"]);
  const [statusA, setStatusA] = useState({});
  const [statusB, setStatusB] = useState({});
  const [pointsA, setPointsA] = useState(0);
  const [pointsB, setPointsB] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hideCompleted, setHideCompleted] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [pa, pb] = await Promise.all([
          fetch(PROGRESS_GET_URL(COMPETITION_ID, "Team Tuna")),
          fetch(PROGRESS_GET_URL(COMPETITION_ID, "Team Chkn")),
        ]);

        let A = {}, B = {}, pA = 0, pB = 0;
        if (pa.ok) {
          const a = await pa.json();
          A = a.tiles || a.teams?.["Team Tuna"]?.tiles || {};
          pA = a.points_total ?? completedCount(A) * 5;
        }
        if (pb.ok) {
          const b = await pb.json();
          B = b.tiles || b.teams?.["Team Chkn"]?.tiles || {};
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

  // Team Tuna unlocks
  const doneAActive  = completedCount(statusA, activeIds);
  const doneAPassive = completedCount(statusA, passiveIds);
  const totalA       = doneAActive + doneAPassive;
  const { active: activeUnlockedA, passive: passiveUnlockedA } = unlockedCounts(totalA);
  let activeTilesA  = activeAll.slice(0, activeUnlockedA);
  let passiveTilesA = passiveAll.slice(0, passiveUnlockedA);

  // Team Chkn
  const doneBActive  = completedCount(statusB, activeIds);
  const doneBPassive = completedCount(statusB, passiveIds);
  const totalB       = doneBActive + doneBPassive;
  const { active: activeUnlockedB, passive: passiveUnlockedB } = unlockedCounts(totalB);
  let activeTilesB  = activeAll.slice(0, activeUnlockedB);
  let passiveTilesB = passiveAll.slice(0, passiveUnlockedB);

  if (hideCompleted) {
    activeTilesA  = activeTilesA.filter(t => !isDone(statusA, t));
    passiveTilesA = passiveTilesA.filter(t => !isDone(statusA, t));
    activeTilesB  = activeTilesB.filter(t => !isDone(statusB, t));
    passiveTilesB = passiveTilesB.filter(t => !isDone(statusB, t));
  }

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
      <div className="sb-controls">
        <button
          type="button"
          className="sb-toggleBtn"
          onClick={() => setHideCompleted(v => !v)}
        >
          {hideCompleted ? "Show Completed" : "Hide Completed"}
        </button>
      </div>

      <div className="sb-boards">
        {/* Team Tuna */}
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
                showInfoBtn={true}
                cols={Math.max(1, passiveTilesA.length)}
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
              showInfoBtn={true}
              cols={5}
            />
          </div>
        </section>

        {/* Team Chkn */}
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
                showInfoBtn={true}
                cols={Math.max(1, passiveTilesB.length)}
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
              showInfoBtn={true}
              cols={5}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default SummerBingo;
