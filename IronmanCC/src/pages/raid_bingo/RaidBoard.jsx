import React from "react";
import "./RaidBoard.css";
import BingoTile from "components/tiles/BingoTile";
import raidTiles from "json/RaidTiles.json";

const RaidBoard = () => {
  const rowSizes = [4, 4, 4, 3, 3, 1, 3, 3, 1];

  const handleInfoClick = (tileMeta) => {
    console.log("Info clicked on tile:", tileMeta);
  };

  let currentIndex = 0;

  return (
    <div className="raid-board">
      {rowSizes.map((size, rowIndex) => {
        const rowTiles = raidTiles.slice(currentIndex, currentIndex + size);
        currentIndex += size;

        const rowClass = size === 1 ? "raid-row single-tile-row" : "raid-row";

        return (
          <div className={rowClass} key={rowIndex}>
            {rowTiles.map((tile) => (
              <BingoTile
                key={tile.TileNumber}
                tile={tile}
                tileMeta={tile}
                onInfoClick={handleInfoClick}
                onAdminClick={null}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default RaidBoard;
