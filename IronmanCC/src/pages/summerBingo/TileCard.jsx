import { useMemo, useState, useEffect } from "react";
import StatusBadge from "./StatusBadge";
import "./TileCard.css";

const TileCard = ({ tile, status, redacted = false }) => {
  const [open, setOpen] = useState(false);

  const goal = status?.goal ?? 1;
  const progress = status?.progress ?? 0;

  const state = useMemo(() => {
    if (!status || status.status === "not_started") return "not-started";
    if (status.status === "completed" || progress >= goal) return "completed";
    return "in-progress";
  }, [status, goal, progress]);

  const pct = Math.min(100, Math.round((progress / goal) * 100));

  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") setOpen(false); };
    if (open) document.addEventListener("keydown", onKey);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className={`summerBingo-tile is-${state} ${redacted ? "is-redacted" : ""}`}>
        {!redacted && (
          <button
            type="button"
            className="summerBingo-infoBtn"
            aria-label="Details"
            onClick={() => tile.LongDescription && setOpen(true)}
          >
            <img src="/icons/info.svg" alt="" />
          </button>
        )}

        {!redacted && (
          <div className={`summerBingo-diff summerBingo-diff--${tile.Type || "easy"}`}>
            {(tile.Type || "easy").toUpperCase()}
          </div>
        )}

        {!redacted ? (
          <div className="summerBingo-body">
            <img className="summerBingo-img" src={tile.Image} alt={tile.Name} />
            <div className="summerBingo-text">
              <div className="summerBingo-title">{tile.Name}</div>
              <div className="summerBingo-desc">{tile.Description}</div>
            </div>
          </div>
        ) : (
          <div className="summerBingo-redactedBody" />
        )}

        <StatusBadge
          state={state}
          progress={progress}
          goal={goal}
          pct={pct}
          compact={redacted}
        />
      </div>

      {!redacted && open && (
        <div className="summerBingo-modalOverlay" onClick={() => setOpen(false)}>
          <div
            className="summerBingo-modal"
            role="dialog"
            aria-modal="true"
            onClick={e => e.stopPropagation()}
          >
            <div className="summerBingo-modalHeader">
              <div className="summerBingo-modalTitle">{tile.Name}</div>
              <button
                type="button"
                className="summerBingo-modalClose"
                aria-label="Close"
                onClick={() => setOpen(false)}
                autoFocus
              >
                x
              </button>
            </div>
            <div className="summerBingo-modalBody">{tile.LongDescription}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default TileCard;
