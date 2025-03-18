import React from "react";
import "./OSRSTiles.css";

function AdminTile({ tile, tileMeta, onClick }) {
  const categoryClass = tileMeta?.category
    ? tileMeta.category.toLowerCase() 
    : "";

  return (
    <div
      className={`osrs-tile ${categoryClass} ${
        tile.IsCompleted ? "completed" : ""
      }`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      {tileMeta?.image && (
        <img src={tileMeta.image} alt={tileMeta.name} />
      )}

      <div className="tile-name">
        {tileMeta ? tileMeta.name : `Tile ${tile.TileNumber}`}
      </div>
    </div>
  );
}

export default AdminTile;
