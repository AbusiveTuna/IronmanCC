import { useMemo, useState } from "react";
import StatusBadge from "./components/StatusBadge";
import TileModal from "./components/TileModal";
import "./TileCard.css";

const TileCard = ({ tile, status, redacted = false, showDesc = false, showInfoBtn = true }) => {
  const [open, setOpen] = useState(false);

  const goal = status?.goal ?? tile.Goal ?? 1;
  const progress = status?.progress ?? 0;

  const state = useMemo(() => {
    if (!status || status.status === "not_started") return "not-started";
    if (status.status === "completed" || progress >= goal) return "completed";
    return "in-progress";
  }, [status, goal, progress]);

  const pct = Math.min(100, Math.round((progress / goal) * 100));

  return (
    <>
      <div className={`summerBingo-tile is-${state} ${redacted ? "is-redacted" : ""}`}>
        {!redacted && showInfoBtn && (
          <button
            type="button"
            className="summerBingo-infoBtn"
            aria-label="Details"
            onClick={() => tile.LongDescription && setOpen(true)}
          >
            <img src="/osrs_icons/Items/cake.png" alt="" />
          </button>
        )}

        {!redacted && (
          <div className={`summerBingo-diff summerBingo-diff--${tile.Type || "easy"}`}>
            {(tile.Type || "easy").toUpperCase()}
          </div>
        )}

        <div className="summerBingo-content">
          {!redacted ? (
            <div className="summerBingo-body">
              <img className="summerBingo-img" src={tile.Image} alt={tile.Name} />
              <div className="summerBingo-title">{tile.Name}</div>
              {showDesc && <div className="summerBingo-desc">{tile.Description}</div>}
            </div>
          ) : (
            <div className="summerBingo-redactedBody" />
          )}

          <div className="summerBingo-footer">
            <div className="summerBingo-bar">
              <div className="summerBingo-barFill" style={{ width: `${pct}%` }} />
            </div>
            <StatusBadge
              state={state}
              progress={progress}
              goal={goal}
              pct={pct}
              compact={redacted}
            />
          </div>
        </div>
      </div>

      <TileModal open={!!(!redacted && open)} title={tile.Name} onClose={() => setOpen(false)}>
        {tile.LongDescription || "No additional details."}
      </TileModal>
    </>
  );
};

export default TileCard;
