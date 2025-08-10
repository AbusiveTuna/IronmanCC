import { useMemo } from "react";
import "./SummerBingo.css";
import tiles from "./tiles.json";
import statusA from "./status.mock.json";
import statusB from "./status.mock.json";
import Board from "./Board";

function completedCount(statusMap) {
  return Object.values(statusMap || {}).filter(
    s => s?.status === "completed" || (s?.goal ?? 1) <= (s?.progress ?? 0)
  ).length;
}

function rowsUnlocked(statusMap) {
  const completed = completedCount(statusMap);
  return Math.min(1 + Math.floor(completed / 3), 5);
}

const SummerBingo = () => {
  const board = useMemo(() => tiles.slice(0, 25), []);
  const rowsA = rowsUnlocked(statusA);
  const rowsB = rowsUnlocked(statusB);
  const sharedRows = Math.min(rowsA, rowsB);

  const pointsA = completedCount(statusA) * 5;
  const pointsB = completedCount(statusB) * 5;

  return (
    <div className="summerBingo-wrap">
      <div className="summerBingo-boards">
        <section className="summerBingo-team">
          <header className="summerBingo-teamHeader">
            <h2>Team A</h2>
            <div className="summerBingo-points">{pointsA} pts</div>
          </header>
          <Board
            tiles={board}
            statusMap={statusA}
            visibleRows={sharedRows}
            style={{ "--tile-max": "160px" }}
          />
        </section>

        <section className="summerBingo-team">
          <header className="summerBingo-teamHeader">
            <h2>Team B</h2>
            <div className="summerBingo-points">{pointsB} pts</div>
          </header>
          <Board
            tiles={board}
            statusMap={statusB}
            visibleRows={sharedRows}
            style={{ "--tile-max": "160px" }}
          />
        </section>
      </div>
    </div>
  );
};

export default SummerBingo;
