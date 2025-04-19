import React from "react";
import "./BingoTile.css";

const BingoTile = ({
  tile,
  tileMeta,
  onInfoClick,
  onAdminClick,
  onContextMenu,
  size = "medium"
}) => {
  let categoryClass = tileMeta?.category ? tileMeta.category.toLowerCase() : "";
  const tileCount = tile.currentCount;
  const maxCount = tile.maxCount;
  let tileCountDisplay;

  if (tileCount !== undefined && maxCount !== undefined) {
    tileCountDisplay = `${tileCount}/${maxCount}`;
    if (tileCount > 0 && tileCount < maxCount) {
      categoryClass = "mid";
    }
  }

  if (!tileMeta) {
    return (
      <div className={`bingo-tile ${size} ${tile.IsCompleted ? "completed" : ""}`}>
        <p className="bingo-tile-name">Tile {tile.TileNumber}</p>
      </div>
    );
  }

  return (
    <div
      className={`bingo-tile ${size} ${tile.IsCompleted ? "completed" : ""} ${categoryClass}`}
      onClick={onAdminClick}
      onContextMenu={(e) => {
        if (onContextMenu) {
          e.preventDefault();
          onContextMenu(e);
        }
      }}
    >
      <div className="bingo-tile-content">
        {tileMeta.image && (
          <img
            src={tileMeta.image}
            alt={tileMeta.name}
            className="bingo-tile-image"
          />
        )}
        <div className="bingo-tile-name">{tileMeta.name}</div>
        <div className="bingo-tile-count-progress">{tileCountDisplay}</div>
      </div>

      {tileMeta.description && onInfoClick && (
        <button
          className="bingo-tile-info-button"
          onClick={(e) => {
            e.stopPropagation();
            onInfoClick(tileMeta);
          }}
        >
          i
        </button>
      )}
    </div>
  );
};

export default BingoTile;
