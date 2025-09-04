import "./WinterAdminGrid.css";
import Tile from "components/bingo/tiles/Tile";
import { isComplete, withEntry } from "./winterUtils";

const WinterGrid = ({ rows, mapA, mapB, editing, onInc, onDec }) => {
  return (
    <div className="WinterAdmin-grid">
      {rows.flat().map((t) => {
        if (!t) return null;
        const aDone = isComplete(mapA[t.Id], t.Goal);
        const bDone = isComplete(mapB[t.Id], t.Goal);
        const claimed = aDone ? "A" : bDone ? "B" : null;
        const isPassive = t.Type === "passive";

        const activeMap = editing === "A" ? mapA : mapB;
        const { progress, goal } = withEntry(activeMap, t);

        return (
          <div
            key={t.Id}
            className={[
              "WinterAdmin-cell",
              isPassive ? "is-passive" : "",
              claimed === "A" ? "is-claimed-A" : "",
              claimed === "B" ? "is-claimed-B" : "",
            ].join(" ")}
            onClick={() => onInc(t)}
            onContextMenu={(e) => {
              e.preventDefault();
              onDec(t);
            }}
            title="Click +1, Right-click -1"
          >
            {isPassive && <div className="WinterAdmin-badge">Passive</div>}
            <Tile
              image={t.Image}
              name={t.Name}
              description={t.Description}
              longDescription={t.LongDescription}
              tileProgress={progress}
              tileGoal={goal}
            />
            <div className="WinterAdmin-mini">
              {editing} {progress}/{goal}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WinterGrid;
