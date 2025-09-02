import "./TileProgressBar.css";

const TileProgressBar = ({ current = 0, goal = 1 }) => {
  const safeGoal = Math.max(1, Number(goal) || 1);
  const safeCurrent = Math.max(0, Number(current) || 0);
  const pct = Math.min(100, Math.round((safeCurrent / safeGoal) * 100));

  return (
    <div className="ProgressBar-root" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="ProgressBar-fill" style={{ width: `${pct}%` }} />
      <div className="ProgressBar-label">
        {Math.min(safeCurrent, safeGoal)}/{safeGoal}
      </div>
    </div>
  );
};

export default TileProgressBar;
