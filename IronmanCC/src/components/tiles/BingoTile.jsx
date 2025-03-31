import React from "react";
import "./BingoTile.css";

const BingoTile = ({ tile, tileMeta, onInfoClick, onAdminClick, size = "medium" }) => {
  const categoryClass = tileMeta?.category ? tileMeta.category.toLowerCase() : "";

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
