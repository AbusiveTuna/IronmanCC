const StatusBadge = ({ state, progress, goal, pct, compact = false }) => {
  if (compact) {
    if (state === "completed") {
      return <div className="summerBingo-badge summerBingo-badge--compact">✔</div>;
    }
    return <div className="summerBingo-badge summerBingo-badge--compact" />;
  }

  if (state === "completed") return <div className="summerBingo-badge">Completed</div>;
  if (state === "not-started") return <div className="summerBingo-badge">Not started</div>;
  return <div className="summerBingo-badge">{progress}/{goal} ({pct}%)</div>;
};

export default StatusBadge;
