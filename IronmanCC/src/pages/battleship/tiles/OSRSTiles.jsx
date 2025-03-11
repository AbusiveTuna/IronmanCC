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

  return (
    <div>
      <h2>Team: {teamName}</h2>
      {!tileData ? (
        <p>Loading tiles...</p>
      ) : (
        <div className="osrs-board">
          {tileData.map((tile) => {
            const tileMeta = tilesMetadata.find(
              (meta) => meta.TileNumber === tile.TileNumber
            );
            return (
              <OSRSTile
                key={tile.TileNumber}
                tile={tile}
                tileMeta={tileMeta}
                onInfoClick={handleInfoClick}
              />
            );
          })}
        </div>
      )}

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
