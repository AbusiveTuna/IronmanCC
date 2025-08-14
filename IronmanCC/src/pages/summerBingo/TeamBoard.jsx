import "./TeamBoard.css";
import Board from "./components/Board";
import useTeamBoardData from "./hooks/useTeamBoardData";

function completedActiveCount(map, activeIds) {
  const ids = new Set(activeIds);
  return Object.entries(map || {}).filter(([id, s]) => {
    if (!ids.has(id)) return false;
    const goal = s?.goal ?? 1;
    const prog = s?.progress ?? 0;
    return (s?.status === "completed") || prog >= goal;
  }).length;
}

// groups: start with 1 group (5 active + 1 passive). +1 group per 3 active completions.
// max 8 groups for 40 active; max 5 for passives.
function unlockedCounts(activeCompleted) {
  const groups = Math.max(1, 1 + Math.floor(activeCompleted / 3));
  return {
    active: Math.min(groups * 5, 40),
    passiveGroups: Math.min(groups, 5)
  };
}

const TeamBoard = ({ teamName, tileMax = "220px", competitionId = 101 }) => {
  const { statusMap, points, loading, all } = useTeamBoardData(teamName, competitionId);

  // split tiles
  const activeTilesAll = all.filter(t => !t.Passive).slice(0, 40);
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

  const activeDone = completedActiveCount(statusMap, activeTilesAll.map(t => String(t.Id)));
  const { active: activeUnlocked, passiveGroups } = unlockedCounts(activeDone);

  const activeTiles = activeTilesAll.slice(0, activeUnlocked);
  const passiveTiles = passiveTilesAll.slice(0, passiveGroups);

  return (
    <section className="summerBingo-team">
      <header className="summerBingo-teamHeader">
        <h2>{teamName}</h2>
        <div className="summerBingo-points">{points} pts</div>
      </header>

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
