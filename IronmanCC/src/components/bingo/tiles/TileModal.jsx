import "./TileModal.css";
import TileProgressBar from "./TileProgressBar";

const TileModal = ({
  isOpen,
  title,
  short,
  longContent,
  current,
  goal,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="Tile-overlay" onClick={onClose}>
      <div
        className="Tile-dialog"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="Tile-dialogHeader">
          <h3 className="Tile-dialogTitle">{title}</h3>
          <button className="Tile-dialogClose" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="Tile-dialogBody">
          <p className="Tile-dialogShort">{short}</p>
          <div className="Tile-dialogLong">
            {typeof longContent === "string" ? <p>{longContent}</p> : longContent}
          </div>

          <div className="Tile-dialogSection">
            <TileProgressBar current={current} goal={goal} />
          </div>
        </div>

        <div className="Tile-dialogFooter">
          <button className="Tile-dialogOk" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default TileModal;
