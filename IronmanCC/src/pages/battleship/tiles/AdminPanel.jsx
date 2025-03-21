import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./OSRSTiles.css";
import AdminTile from "./AdminTile";
import tilesMetadata from "./osrsTilesData.json";

const AdminPanel = () => {
  const { teamId } = useParams();
  const [nextShotCode, setNextShotCode] = useState("");
  const [teamName, compId] = teamId.split("-");
  const [tileData, setTileData] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [changedTileIndex, setChangedTileIndex] = useState(null);

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

  const completedCount = tileData.filter((tile) => tile.IsCompleted).length;
  const additionalGroups = Math.floor(completedCount / 3);
  const revealedTilesCount = 5 + additionalGroups * 5;

  const handleTileClick = (index) => {
    if (changedTileIndex !== null && changedTileIndex !== index) {
      return;
    }
    const updatedTiles = [...tileData];
    updatedTiles[index] = {
      ...updatedTiles[index],
      IsCompleted: !updatedTiles[index].IsCompleted,
    };
    setTileData(updatedTiles);
    setHasChanges(true);
    setChangedTileIndex(index);
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
            updatedTiles: tileData,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to save tile data.");
      }
      setHasChanges(false);
      setChangedTileIndex(null);

      // Fetch the next shot code
      const shotResponse = await fetch(
        `https://ironmancc-89ded0fcdb2b.herokuapp.com/admin-battleship-get-next-shot?teamName=${teamName}&compId=${compId}`
      );

      if (!shotResponse.ok) {
        throw new Error("Failed to fetch next shot.");
      }

      setNextShotCode(await shotResponse.json());
      console.log("Tile data saved successfully.");
    } catch (error) {
      console.error("Error saving tile data:", error);
    }
  };

  const visibleTiles = tileData.filter(
    (tile) => tile.TileNumber <= revealedTilesCount
  );

  return (
    <div className="admin-panel-container">
      <div className="admin-panel-header">
        <h2>
          Admin Panel for team: {teamName} — Click a tile to toggle it, then
          click "Save Changes".
        </h2>
        {hasChanges && (
          <button className="save-changes-button" onClick={handleSaveChanges}>
            Save Changes
          </button>
        )}
      </div>
  
      {nextShotCode && (
        <div className="next-shot-container">
          <h3>Next Shot Code:</h3>
          <p className="next-shot-code">{nextShotCode}</p>
          <p className="next-shot-code">Note: if this code isn't used by the time you input another tile, you will get the same code.</p>
        </div>
      )}
  
      {!tileData.length ? (
        <p>Loading tiles...</p>
      ) : (
        <div className="osrs-board">
          {visibleTiles.map((tile, index) => {
            const fullIndex = tileData.findIndex(
              (t) => t.TileNumber === tile.TileNumber
            );
            const tileMeta = tilesMetadata.find(
              (meta) => meta.TileNumber === tile.TileNumber
            );
  
            return (
              <AdminTile
                key={tile.TileNumber}
                tile={tile}
                tileMeta={tileMeta}
                onClick={() => handleTileClick(fullIndex)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
  
};

export default AdminPanel;
