import React from "react";
import BingoTile from "components/tiles/BingoTile";
import tilesMetadata from "common/json/March2025Tiles.json";
import './TileBoard.css';

const TileBoard = ({
  tileData,
  hideCompleted = false,
  hideUnrevealed = false,
  revealedTilesCount,
  onInfoClick,
  onAdminClick,
  adminMode = false,
}) => {
  if (!tileData) return null;

  const visibleTiles = tileData
    .filter((tile) => {
      if (!tile) return false;
      if (!adminMode) {
        if (hideCompleted && tile.IsCompleted) return false;
        if (hideUnrevealed && tile.TileNumber > revealedTilesCount) return false;
      }
      return tile.TileNumber <= revealedTilesCount;
    });

  return (
    <div className="osrs-board">
      {visibleTiles.map((tile) => {
        const tileMeta = tilesMetadata.find(
          (meta) => meta.TileNumber === tile.TileNumber
        );
        const isRevealed = tile.TileNumber <= revealedTilesCount;

        const displayMeta = isRevealed
          ? tileMeta
          : { name: "?", description: "Hidden Tile" };

        return (
          <BingoTile
            key={tile.TileNumber}
            tile={tile}
            tileMeta={displayMeta}
            onInfoClick={isRevealed ? onInfoClick : null}
            onAdminClick={adminMode ? () => onAdminClick(tile.TileNumber) : null}
          />
        );
      })}
    </div>
  );
};

export default TileBoard;
