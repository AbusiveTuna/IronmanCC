import React from "react";
import "./RaidBoard.css";
import BingoTile from "components/tiles/BingoTile";
import raidTiles from "json/RaidTiles.json";

const RaidBoard = () => {
  const rowGroups = [
    [4, 4, 4],    // Section 1
    [4, 4, 2],    // Section 2
    [3, 3, 1],    // Section 3
    [3, 3],       // Section 4
  ];

  const handleInfoClick = (tileMeta) => {
    console.log("Info clicked on tile:", tileMeta);
  };

  let currentIndex = 0;

  return (
    <div className="raid-board">
      {rowGroups.map((group, sectionIndex) => (
        <div className="raid-section" key={`section-${sectionIndex}`}>
          {group.map((size, rowIndex) => {
            const rowTiles = raidTiles.slice(currentIndex, currentIndex + size);
            currentIndex += size;

            const rowClass = size === 1 ? "raid-row single-tile-row" : "raid-row";

            return (
              <div className={rowClass} key={`row-${sectionIndex}-${rowIndex}`}>
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
      ))}
    </div>
  );
};

export default RaidBoard;
