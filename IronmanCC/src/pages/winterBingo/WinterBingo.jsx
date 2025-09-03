import { useMemo, useState, useEffect } from "react";
import "./WinterBingo.css";
import tiles from "./tiles.json";
import useWinterBingoData from "./useWinterBingoData";
import BoardGrid from "./BoardGrid";
import PetStrip from "./PetStrip";
import { isComplete, num } from "./winterBingoUtils";

const ROWS = 10;
const COLS = 10;
const HIDE_KEY = "winterBingo.hideCompleted";

function buildRows(list, rows, cols) {
  return Array.from({ length: rows }, (_, r) => list.slice(r * cols, (r + 1) * cols));
}

const WinterBingo = ({
  competitionId = 111,
  teamAName = "Team Lukas",
  teamBName = "Team Bonsai",
}) => {
  const { mapA, mapB, pointsA, pointsB } = useWinterBingoData({ competitionId, teamAName, teamBName });

  const [hideCompleted, setHideCompleted] = useState(
    () => localStorage.getItem(HIDE_KEY) === "1"
  );
  useEffect(() => {
    localStorage.setItem(HIDE_KEY, hideCompleted ? "1" : "0");
  }, [hideCompleted]);

  const petTiles = useMemo(() => tiles.filter((t) => t.Type === "pet-passive"), []);
  const gridTiles = useMemo(() => tiles.filter((t) => t.Type !== "pet-passive"), []);
  const rows = useMemo(() => buildRows(gridTiles, ROWS, COLS), [gridTiles]);

  const rowCompletedShared = useMemo(
    () =>
      rows.map((row) =>
        row
          .filter((t) => t && t.Type !== "passive")
          .every((t) => isComplete(mapA[t.Id], t.Goal) || isComplete(mapB[t.Id], t.Goal))
      ),
    [rows, mapA, mapB]
  );

  const visibleRows = useMemo(() => {
    const firstIncomplete = rowCompletedShared.findIndex((v) => !v);
    return firstIncomplete === -1 ? ROWS : Math.min(firstIncomplete + 1, ROWS);
  }, [rowCompletedShared]);

  const unlockedPetCount = useMemo(
    () => Math.min(1 + rowCompletedShared.filter(Boolean).length, petTiles.length),
    [rowCompletedShared, petTiles.length]
  );

  return (
    <section className="WinterBingo-root">
      <header className="WinterBingo-header">
        <h2 className="WinterBingo-title">BONSAI x LUKAS Winter Special Bingo</h2>
        <div className="WinterBingo-actions">
          <button
            type="button"
            className="WinterBingo-toggleBtn"
            aria-pressed={hideCompleted}
            onClick={() => setHideCompleted((v) => !v)}
          >
            {hideCompleted ? "Show Completed Tiles" : "Hide Completed Tiles"}
          </button>
        </div>
      </header>

      <div className="WinterBingo-score">
        <div className="WinterBingo-team">
          <span className="WinterBingo-dot is-A" />
          <span className="WinterBingo-teamName">{teamAName}</span>
          <span className="WinterBingo-points">{num(pointsA, 0)}</span>
        </div>
        <div className="WinterBingo-team">
          <span className="WinterBingo-dot is-B" />
          <span className="WinterBingo-teamName">{teamBName}</span>
          <span className="WinterBingo-points">{num(pointsB, 0)}</span>
        </div>
      </div>

      {!!petTiles.length && (
        <PetStrip
          petTiles={petTiles}
          unlockedCount={unlockedPetCount}
          mapA={mapA}
          mapB={mapB}
          hideCompleted={hideCompleted}
        />
      )}

      <BoardGrid
        rows={rows}
        cols={COLS}
        visibleRows={visibleRows}
        mapA={mapA}
        mapB={mapB}
        hideCompleted={hideCompleted}
      />
    </section>
  );
};

export default WinterBingo;
