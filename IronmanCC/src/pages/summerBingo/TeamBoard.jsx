import "./TeamBoard.css";
import Board from "./components/Board";
import useTeamBoardData from "./hooks/useTeamBoardData";

function completedCount(map, ids) {
  const allow = ids ? new Set(ids.map(String)) : null;
  return Object.entries(map || {}).filter(([id, s]) => {
    if (allow && !allow.has(id)) return false;
    return s?.status === "completed";
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
    passiveGroups: Math.min(groups, 5),
  };
}

function tilesUntilNextUnlock(totalCompleted, activeUnlocked) {
  const targets = [];
  if (activeUnlocked < 40) {
    const nextBase = Math.min(21, 3 * (Math.floor(totalCompleted / 3) + 1));
    if (totalCompleted < nextBase) targets.push(nextBase);
  } else if (activeUnlocked < 55) {
    [30, 33, 36].forEach(t => {
      if (totalCompleted < t) targets.push(t);
    });
  }
  if (!targets.length) return null;
  return Math.min(...targets) - totalCompleted;
}

const TeamBoard = ({ teamName, tileMax = "220px", competitionId = 101 }) => {
  const { statusMap, points, loading, all } = useTeamBoardData(teamName, competitionId);

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
            <div className="summerBingo-board" style={{ "--tile-max": tileMax, gridTemplateColumns: "repeat(1, minmax(0, var(--tile-max)))" }}>
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

  const activeTiles = activeTilesAll.slice(0, activeUnlocked);
  const passiveTiles = passiveTilesAll.slice(0, passiveGroups);

  return (
    <section className="summerBingo-team">
      <header className="summerBingo-teamHeader">
        <h2>{teamName}</h2>
        <div className="summerBingo-points">{points} pts</div>
      </header>

      {toNext !== null && (
        <div className="summerBingo-nextUnlock">
          {toNext} to next unlock
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
