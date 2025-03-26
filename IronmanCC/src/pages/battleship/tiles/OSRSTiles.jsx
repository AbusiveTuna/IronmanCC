import React, { useState } from "react";
import useGetTileData from "./hooks/useGetTileData";
import { useParams } from "react-router-dom";
import tilesMetadata from "./json/March2025Tiles.json";
import BingoTile from "./components/BingoTile";
import TilesModal from "./components/TilesModal";
import Legend from "./components/Legend";
import "./OSRSTiles.css";

const OSRSTiles = () => {
  const { teamId } = useParams();
  const [teamName, compId] = teamId.split("-");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [hideCompleted, setHideCompleted] = useState(() => {
    const saved = localStorage.getItem("hideCompleted");
    return saved ? JSON.parse(saved) : false;
  });
  const [hideUnrevealed, setHideUnrevealed] = useState(() => {
    const saved = localStorage.getItem("hideUnrevealed");
    return saved ? JSON.parse(saved) : false;
  });

  const [tileData] = useGetTileData(teamName, compId);

  const handleInfoClick = (tileMeta) => {
    setModalContent(tileMeta);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalContent({});
  };

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

  const completedCount = tileData.filter((tile) => tile.IsCompleted).length;
  const additionalGroups = Math.floor(completedCount / 3);
  const revealedTilesCount = 5 + additionalGroups * 5;

  return (
    <div className="battleship-tiles-container">
      <div className="battleship-tiles-header-container">
        <Legend/>
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
                <BingoTile
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
