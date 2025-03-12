import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import tilesMetadata from "./osrsTilesData.json";
import OSRSTile from "./OSRSTile";
import TilesModal from "./TilesModal";
import "./OSRSTiles.css";

const OSRSTiles = () => {
  const { teamId } = useParams();
  const [teamName, compId] = teamId.split("-");
  const [tileData, setTileData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});

  // (1) Load the user’s previous setting from local storage or default to 'false'
  const [hideCompleted, setHideCompleted] = useState(() => {
    const saved = localStorage.getItem("hideCompleted");
    return saved ? JSON.parse(saved) : false;
  });

  const [hideUnrevealed, setHideUnrevealed] = useState(() => {
    const saved = localStorage.getItem("hideUnrevealed");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await fetch(
          `https://ironmancc-89ded0fcdb2b.herokuapp.com/battleship-tiles?teamName=${teamName}&compId=${compId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch game data.");
        }
        const data = await response.json();
        setTileData(data);
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    };
    fetchGameData();
  }, [teamName, compId]);

  const handleInfoClick = (tileMeta) => {
    setModalContent(tileMeta);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalContent({});
  };

  // (2) When toggling, update both React state and local storage
  const handleToggleCompleted = () => {
    setHideCompleted((prev) => {
      const newValue = !prev;
      localStorage.setItem("hideCompleted", JSON.stringify(newValue));
      return newValue;
    });
  };

  const handleToggleUnrevealed = () => {
    setHideUnrevealed((prev) => {
      const newValue = !prev;
      localStorage.setItem("hideUnrevealed", JSON.stringify(newValue));
      return newValue;
    });
  };

  if (!tileData) {
    return (
      <div className="container">
        <h2>Team: {teamName}</h2>
        <p>Loading tiles...</p>
      </div>
    );
  }

  // Logic to calculate which tiles are revealed
  const completedCount = tileData.filter((tile) => tile.IsCompleted).length;
  const additionalGroups = Math.floor(completedCount / 3);
  const revealedTilesCount = 5 + additionalGroups * 5;

  return (
    <div className="battleship-tiles-container">
      <div className="battleship-tiles-header-container">
        <h2>Team: {teamName}</h2>
        <div className="battleship-tiles-button-group">
          <button
            className="battleship-tiles-toggle-button"
            onClick={handleToggleCompleted}
          >
            {hideCompleted ? "Show Completed Tiles" : "Hide Completed Tiles"}
          </button>

          <button
            className="battleship-tiles-toggle-button"
            onClick={handleToggleUnrevealed}
          >
            {hideUnrevealed ? "Show Unrevealed Tiles" : "Hide Unrevealed Tiles"}
          </button>
        </div>
      </div>

      <div className="battleship-tiles-board-container">
        <div className="osrs-board">
          {tileData
            .filter((tile) => {
              if (hideCompleted && tile.IsCompleted) {
                return false;
              }
              if (hideUnrevealed && tile.TileNumber > revealedTilesCount) {
                return false;
              }
              return true;
            })
            .map((tile) => {
              const tileMeta = tilesMetadata.find(
                (meta) => meta.TileNumber === tile.TileNumber
              );
              const isRevealed = tile.TileNumber <= revealedTilesCount;

              const displayMeta = isRevealed
                ? tileMeta
                : { name: "?", description: "Hidden Tile" };

              return (
                <OSRSTile
                  key={tile.TileNumber}
                  tile={tile}
                  tileMeta={displayMeta}
                  onInfoClick={isRevealed ? handleInfoClick : null}
                />
              );
            })}
        </div>
      </div>

      {showModal && (
        <TilesModal onClose={handleCloseModal}>
          <h3>{modalContent.name}</h3>
          <p>{modalContent.description}</p>
          <button onClick={handleCloseModal}>Close</button>
        </TilesModal>
      )}
    </div>
  );
};

export default OSRSTiles;
