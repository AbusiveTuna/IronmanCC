import React from "react";

function OSRSTile({ tile, tileMeta, onInfoClick }) {
  if (!tileMeta) {
    return (
      <div className={`osrs-tile ${tile.IsCompleted ? "completed" : ""}`}>
        <p className="tile-name">Tile {tile.TileNumber}</p>
      </div>
    );
  }

  return (
    <div className={`osrs-tile ${tile.IsCompleted ? "completed" : ""}`}>
      <img src={tileMeta.image} alt={tileMeta.name} />
      <div className="tile-name">{tileMeta.name}</div>
      {tileMeta.description && (
        <button className="info-button" onClick={() => onInfoClick(tileMeta)}>
          i
        </button>
      )}
    </div>
  );
}

export default OSRSTile;
