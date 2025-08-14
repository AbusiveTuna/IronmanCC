import TileCard from "../TileCard";

const Board = ({ tiles, statusMap, visibleRows = 1, style, showDesc = false, cols = 5 }) => {
  return (
    <div
      className="summerBingo-board"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, var(--tile-max, 160px)))`, ...style }}
    >
      {tiles.map((t, i) => {
        const row = Math.floor(i / cols);
        const redacted = row >= visibleRows;
        return (
          <TileCard
            key={t.Id}
            tile={t}
            status={statusMap?.[t.Id]}
            redacted={redacted}
            showDesc={showDesc}
          />
        );
      })}
    </div>
  );
};

export default Board;
