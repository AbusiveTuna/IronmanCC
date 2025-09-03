import "./PetStrip.css";
import Tile from "components/bingo/tiles/Tile";
import { progressForTile } from "./winterBingoUtils";

export default function PetStrip({ petTiles, unlockedCount, mapA, mapB, hideCompleted }) {
  return (
    <div className="WinterBingo-pets">
      {petTiles.slice(0, unlockedCount).map((t) => {
        const { claimedBy, current, goal } = progressForTile(t, mapA[t.Id], mapB[t.Id]);
        if (hideCompleted && (claimedBy === "A" || claimedBy === "B")) return null;

        return (
          <div
            key={t.Id}
            className={[
              "WinterBingo-petCell",
              claimedBy === "A" ? "is-claimed-A" : "",
              claimedBy === "B" ? "is-claimed-B" : "",
            ].join(" ")}
          >
            <Tile
              image={t.Image}
              name={t.Name}
              description={t.Description}
              longDescription={t.LongDescription}
              tileProgress={current}
              tileGoal={goal}
            />
          </div>
        );
      })}
    </div>
  );
}
