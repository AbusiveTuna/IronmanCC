import TileCard from "../TileCard";

const Board = ({ tiles, statusMap, visibleRows = 1, style, showDesc = false }) => {
  const tilesPerRow = 10;
  return (
    <div className="summerBingo-board" style={style}>
      {tiles.map((t, i) => {
        const row = Math.floor(i / tilesPerRow);
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
