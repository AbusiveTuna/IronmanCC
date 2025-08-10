import React from "react";
import TileCard from "./TileCard";

const Board = ({ tiles, statusMap, visibleRows = 1, style }) => {
  return (
    <div className="summerBingo-board" style={style}>
      {tiles.map((t, i) => {
        const row = Math.floor(i / 5);
        const redacted = row >= visibleRows;
        return (
          <TileCard
            key={t.Id}
            tile={t}
            status={statusMap?.[t.Id]}
            redacted={redacted}
          />
        );
      })}
    </div>
  );
};

export default Board;
