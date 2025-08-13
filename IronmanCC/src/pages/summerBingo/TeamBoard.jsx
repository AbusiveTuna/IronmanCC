import "./SummerBingo.css";
import Board from "./components/Board";
import useTeamBoardData from "./hooks/useTeamBoardData";

function completedCount(map) {
  return Object.values(map || {}).filter(
    (s) => s?.status === "completed" || (s?.progress ?? 0) >= (s?.goal ?? 1)
  ).length;
}

function rowsUnlocked(map) {
  const done = completedCount(map);
  return Math.min(1 + Math.floor(done / 3));
}

const TeamBoard = ({ teamName, tileMax = "220px", competitionId = 101 }) => {
  const { statusMap, points, loading, all } = useTeamBoardData(teamName, competitionId);
  const rows = rowsUnlocked(statusMap);
  const visibleTiles = all.slice(0, rows * 5);

  if (loading) {
    return (
      <section className="summerBingo-team">
        <header className="summerBingo-teamHeader">
          <h2>{teamName}</h2>
          <div className="summerBingo-points">…</div>
        </header>
        <div className="summerBingo-board" style={{ "--tile-max": tileMax }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="summerBingo-tile skeleton" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="summerBingo-team">
      <header className="summerBingo-teamHeader">
        <h2>{teamName}</h2>
        <div className="summerBingo-points">{points} pts</div>
      </header>
      <Board
        tiles={visibleTiles}
        statusMap={statusMap}
        visibleRows={999}
        style={{ "--tile-max": tileMax }}
        showDesc={true}
      />
    </section>
  );
};

export default TeamBoard;
