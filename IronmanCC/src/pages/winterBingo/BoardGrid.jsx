import "./BoardGrid.css";
import Tile from "components/bingo/tiles/Tile";
import { progressForTile } from "./winterBingoUtils";

export default function BoardGrid({ rows, cols, visibleRows, mapA, mapB, hideCompleted }) {
  return (
    <div className="WinterBingo-grid" style={{ "--fb-cols": cols }}>
      {rows.map((row, r) =>
        row.map((t) => {
          if (!t) return null;
          const { claimedBy, current, goal, isPassive } = progressForTile(t, mapA[t.Id], mapB[t.Id]);
          const rowVisible = r < visibleRows;

          if (hideCompleted && (claimedBy === "A" || claimedBy === "B")) return null;

          return (
            <div
              key={t.Id}
              className={[
                "WinterBingo-cell",
                rowVisible ? "is-visible" : "is-hidden",
                isPassive ? "is-passive" : "",
                claimedBy === "A" ? "is-claimed-A" : "",
                claimedBy === "B" ? "is-claimed-B" : "",
              ].join(" ")}
            >
              {rowVisible ? (
                <>
                  {isPassive && <div className="WinterBingo-badge">Passive</div>}
                  <Tile
                    image={t.Image}
                    name={t.Name}
                    description={t.Description}
                    longDescription={t.LongDescription}
                    tileProgress={current}
                    tileGoal={goal}
                  />
                </>
              ) : (
                <div className="WinterBingo-hiddenTile" />
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
