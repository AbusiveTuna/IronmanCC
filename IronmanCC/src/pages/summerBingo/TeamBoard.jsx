import React, { useMemo } from "react";
import "./SummerBingo.css";
import tiles from "./tiles.json";
import Board from "./Board";
import statusA from "./status.mock.json";
import statusB from "./status.mock.json";

function completedCount(map) {
  return Object.values(map || {}).filter(
    s => s?.status === "completed" || (s?.progress ?? 0) >= (s?.goal ?? 1)
  ).length;
}

function rowsUnlocked(map) {
  const done = completedCount(map);
  return Math.min(1 + Math.floor(done / 3), 5);
}

const MOCK = { "Team A": statusA, "Team B": statusB };

const TeamBoard = ({ teamName, tileMax = "220px" }) => {
  const statusMap = MOCK[teamName] ?? {};
  const all = useMemo(() => tiles.slice(0, 25), []);
  const rows = rowsUnlocked(statusMap);
  const visibleTiles = all.slice(0, rows * 5);
  const points = completedCount(statusMap) * 5;

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
      />
    </section>
  );
};

export default TeamBoard;
