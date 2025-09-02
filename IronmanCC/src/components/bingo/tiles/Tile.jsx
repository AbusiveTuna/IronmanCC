import { useState } from "react";
import "./Tile.css";
import TileModal from "./TileModal";
import TileProgressBar from "./TileProgressBar";

const Tile = ({ image, name, description, longDescription, tileProgress, tileGoal }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModalInfo = () => setIsOpen(true);
  const closeModalInfo = () => setIsOpen(false);

  return (
    <>
      <div className="Tile-card">
        <button type="button" className="Tile-infoBtn" onClick={openModalInfo}>i</button>

        <div className="Tile-icon">
          <img src={image} alt={name} />
        </div>

        <div className="Tile-body">
          <h3 className="Tile-name">{name}</h3>
          <p className="Tile-desc">{description}</p>

          <div className="Tile-progress">
            <TileProgressBar current={tileProgress} goal={tileGoal} />
          </div>
        </div>
      </div>

      <TileModal
        isOpen={isOpen}
        title={name}
        short={description}
        longContent={longDescription}
        current={tileProgress}
        goal={tileGoal}
        onClose={closeModalInfo}
      />
    </>
  );
};

export default Tile;
