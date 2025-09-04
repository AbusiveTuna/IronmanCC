import "./WinterAdminHeader.css";

const WinterAdminHeader = ({
  title,
  teamAName,
  teamBName,
  pointsA,
  pointsB,
  editing,
  setEditing,
  onSaveA,
  onSaveB,
  onSaveBoth,
  saving,
}) => {
  return (
    <header className="WinterAdminHeader-root">
      <h2>{title}</h2>

      <div className="WinterAdminHeader-controls">
        <div className="WinterAdminHeader-editing">
          <span>Editing:</span>
          <button
            type="button"
            className={editing === "A" ? "is-active fbA" : "fbA"}
            onClick={() => setEditing("A")}
          >
            {teamAName}
          </button>
          <button
            type="button"
            className={editing === "B" ? "is-active fbB" : "fbB"}
            onClick={() => setEditing("B")}
          >
            {teamBName}
          </button>
        </div>

        <div className="WinterAdminHeader-points">
          <span className="dot fbA" /> {teamAName}: <b>{pointsA}</b>
          <span className="dot fbB" /> {teamBName}: <b>{pointsB}</b>
        </div>

        <div className="WinterAdminHeader-actions">
          <button type="button" onClick={onSaveA} disabled={saving}>Save {teamAName}</button>
          <button type="button" onClick={onSaveB} disabled={saving}>Save {teamBName}</button>
          <button type="button" onClick={onSaveBoth} disabled={saving}>Save Both</button>
        </div>
      </div>
    </header>
  );
};

export default WinterAdminHeader;
