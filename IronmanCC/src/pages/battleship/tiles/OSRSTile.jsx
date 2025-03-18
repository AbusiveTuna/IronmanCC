import React from "react";

function OSRSTile({ tile, tileMeta, onInfoClick }) {
  const categoryClass = tileMeta?.category
    ? tileMeta.category.toLowerCase()
    : "";

  if (!tileMeta) {
    return (
      <div className={`osrs-tile ${tile.IsCompleted ? "completed" : ""}`}>
        <p className="tile-name">Tile {tile.TileNumber}</p>
      </div>
    );
  }

  return (
    <div
      className={`osrs-tile ${tile.IsCompleted ? "completed" : ""} ${categoryClass}`}
    >
      {tileMeta.image && (
        <img
          src={tileMeta.image}
          alt={tileMeta.name}
          className="tile-image"
        />
      )}
      <div className="tile-name">{tileMeta.name}</div>

      {tileMeta.description && onInfoClick && (
        <button
          className="info-button"
          onClick={() => onInfoClick(tileMeta)}
        >
          i
        </button>
      )}
    </div>
  );
}

export default OSRSTile;
