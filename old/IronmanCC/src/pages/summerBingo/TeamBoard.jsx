import "./TeamBoard.css";
import { useState } from 'react';
import Board from "./components/Board";
import useTeamBoardData from "./hooks/useTeamBoardData";

function completedCount(map, ids) {
  const allow = ids ? new Set(ids.map(String)) : null;
  let done = 0;
  for (const [id, s] of Object.entries(map || {})) {
    if (allow && !allow.has(id)) continue;
    if (s?.status === "completed") done++;
  }
  return done;
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
    passiveGroups: Math.min(groups, 5),
  };
}

function tilesUntilNextUnlock(totalCompleted, activeUnlocked) {
  if (activeUnlocked >= 55) return null;

  if (activeUnlocked < 40) {
    const mod = totalCompleted % 3;
    return mod === 0 ? 3 : 3 - mod;
  }

  const nextBonus = [30, 33, 36].find(t => t > totalCompleted);
  return nextBonus ? nextBonus - totalCompleted : null;
}

const TeamBoard = ({ teamName, tileMax = "220px", competitionId = 101 }) => {
  const { statusMap, points, loading, all } = useTeamBoardData(teamName, competitionId);
  const [hideCompleted, setHideCompleted] = useState(false);

  const activeTilesAll = all.filter(t => !t.Passive).slice(0, 55);
  const passiveTilesAll = all.filter(t => t.Passive).slice(0, 5);

  if (loading) {
    return (
      <section className="summerBingo-team">
        <header className="summerBingo-teamHeader">
          <h2>{teamName}</h2>
          <div className="summerBingo-points">…</div>
        </header>
        <div className="summerBingo-columns">
          <div className="summerBingo-main">
            <div className="summerBingo-board" style={{ "--tile-max": tileMax }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="summerBingo-tile skeleton" />
              ))}
            </div>
          </div>
          <aside className="summerBingo-passives">
            <div className="summerBingo-passiveHeader">Passives</div>
            <div
              className="summerBingo-board"
              style={{ "--tile-max": tileMax, gridTemplateColumns: "repeat(1, minmax(0, var(--tile-max)))" }}
            >
              <div className="summerBingo-tile skeleton" />
            </div>
          </aside>
        </div>
      </section>
    );
  }

  const activeIds = activeTilesAll.map(t => String(t.Id));
  const passiveIds = passiveTilesAll.map(t => String(t.Id));

  const activeDone = completedCount(statusMap, activeIds);
  const passiveDone = completedCount(statusMap, passiveIds);
  const totalDone = activeDone + passiveDone;

  const { active: activeUnlocked, passiveGroups } = unlockedCounts(totalDone);
  const toNext = tilesUntilNextUnlock(totalDone, activeUnlocked);

  let activeTiles = activeTilesAll.slice(0, activeUnlocked);
  let passiveTiles = passiveTilesAll.slice(0, passiveGroups);

  if (hideCompleted) {
    activeTiles = activeTiles.filter(t => statusMap[t.Id]?.status !== "completed");
    passiveTiles = passiveTiles.filter(t => statusMap[t.Id]?.status !== "completed");
  }

  return (
    <section className="summerBingo-team">
      <header className="summerBingo-teamHeader">
        <h2>{teamName}</h2>
        <div className="summerBingo-points">{points} pts</div>
      </header>

      <button
        className="summerBingo-toggleBtn"
        onClick={() => setHideCompleted(prev => !prev)}
      >
        {hideCompleted ? "Show Completed" : "Hide Completed"}
      </button>

      {toNext != null && (
        <div className="summerBingo-nextUnlock">
          {toNext} tiles until next unlock
        </div>
      )}

      <div className="summerBingo-columns">
        <div className="summerBingo-main">
          <Board
            tiles={activeTiles}
            statusMap={statusMap}
            visibleRows={999}
            style={{ "--tile-max": "240px" }}
            showDesc
            cols={5}
          />
        </div>

        <aside className="summerBingo-passives">
          <div className="summerBingo-passiveHeader">Passives</div>
          <Board
            tiles={passiveTiles}
            statusMap={statusMap}
            visibleRows={999}
            style={{ "--tile-max": "200px" }}
            showDesc
            cols={1}
          />
        </aside>
      </div>
    </section>
  );
};

export default TeamBoard;
