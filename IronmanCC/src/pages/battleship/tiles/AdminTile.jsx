import React from "react";

const AdminTile = ({ tile, tileMeta, onClick }) => {
  return (
    <div
      className={`osrs-tile ${tile.IsCompleted ? "completed" : ""}`}
      onClick={onClick}
    >
      {tileMeta ? (
        <>
          <img src={tileMeta.image} alt={tileMeta.name} />
          <div className="tile-name">{tileMeta.name}</div>
        </>
      ) : (
        <div className="tile-name">Tile {tile.TileNumber}</div>
      )}
      {tile.IsCompleted && "X"}
    </div>
  );
}

export default AdminTile;
