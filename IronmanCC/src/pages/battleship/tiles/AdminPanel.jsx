import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./OSRSTiles.css";
import AdminTile from "./AdminTile";
import tilesMetadata from "./osrsTilesData.json";

const AdminPanel = () => {
  const { teamId } = useParams();
  const [teamName, compId] = teamId.split("-");
  const [tileData, setTileData] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchTileData = async () => {
      try {
        const response = await fetch(
          `https://ironmancc-89ded0fcdb2b.herokuapp.com/battleship-tiles?teamName=${teamName}&compId=${compId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch tile data.");
        }
        const data = await response.json();
        setTileData(data);
      } catch (error) {
        console.error("Error fetching tile data:", error);
      }
    };
    fetchTileData();
  }, [teamName, compId]);

  const handleTileClick = (index) => {
    const updatedTiles = [...tileData];
    updatedTiles[index] = {
      ...updatedTiles[index],
      IsCompleted: !updatedTiles[index].IsCompleted
    };
    setTileData(updatedTiles);
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        "https://ironmancc-89ded0fcdb2b.herokuapp.com/battleship-tiles",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teamName: teamName,
            compId: compId,
            updatedTiles: tileData
          })
        }
      );
      if (!response.ok) {
        throw new Error("Failed to save tile data.");
      }
      setHasChanges(false);
      console.log("Tile data saved successfully.");
    } catch (error) {
      console.error("Error saving tile data:", error);
    }
  };

  return (
    <div>
      <h2>Admin Panel for team: {teamName}</h2>
      {!tileData.length ? (
        <p>Loading tiles...</p>
      ) : (
        <>
          <div className="osrs-board">
            {tileData.map((tile, index) => {
              const tileMeta = tilesMetadata.find(
                (meta) => meta.TileNumber === tile.TileNumber
              );
              return (
                <AdminTile
                  key={tile.TileNumber}
                  tile={tile}
                  tileMeta={tileMeta}
                  onClick={() => handleTileClick(index)}
                />
              );
            })}
          </div>
          {hasChanges && (
            <button onClick={handleSaveChanges}>Save Changes</button>
          )}
        </>
      )}
    </div>
  );
};

export default AdminPanel;
