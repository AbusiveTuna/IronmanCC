import React, { useState } from "react";
import useGetTileData from "./hooks/useGetTileData";
import { useParams } from "react-router-dom";
import "./OSRSTiles.css";
import TileBoard from "./components/TileBoard";

const AdminPanel = () => {
  const { teamId } = useParams();
  const [nextShotCode, setNextShotCode] = useState("");
  const [teamName, compId] = teamId.split("-");
  const [hasChanges, setHasChanges] = useState(false);
  const [changedTileIndex, setChangedTileIndex] = useState(null);

  const [tileData, setTileData] = useGetTileData(teamName, compId);

  if (tileData == null) {
    return;
  }

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

      const shotResponse = await fetch(
        `https://ironmancc-89ded0fcdb2b.herokuapp.com/admin-battleship-get-next-shot?teamName=${teamName}&compId=${compId}`
      );

      if (!shotResponse.ok) {
        throw new Error("Failed to fetch next shot.");
      }

      setNextShotCode(await shotResponse.json());
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
        <TileBoard
          tileData={tileData}
          revealedTilesCount={revealedTilesCount}
          adminMode={true}
          onAdminClick={(tileNumber) => {
            const index = tileData.findIndex((t) => t.TileNumber === tileNumber);
            handleTileClick(index);
          }}
        />

      )}
    </div>
  );

};

export default AdminPanel;
