import React, { useState } from "react";
import RaidBoard from "./RaidBoard";
import "./RaidBingo.css";
import RaidDrops from "./RaidDrops";

const RaidBingoAdmin = () => {
  const [showDropsModal, setShowDropsModal] = useState(false);
  const [dropsTeam, setDropsTeam] = useState("");

  const openDropsModal = (team) => {
    setDropsTeam(team);
    setShowDropsModal(true);
  };

  const closeDropsModal = () => {
    setShowDropsModal(false);
    setDropsTeam("");
  };

  return (
    <div className="raid-bingo">
      <div className="raid-bingo-teams">
        <div className="raid-board-wrapper">
          <h2 className="raid-bingo-team-name">New Purple Order</h2>
          <button
            className="raid-board-admin-button"
            onClick={() => openDropsModal("New Purple Order")}
          >
            Manage Team Drops
          </button>
          <RaidBoard isAdmin={true} teamName="New Purple Order" />
        </div>

        <div className="raid-board-wrapper">
          <h2 className="raid-bingo-team-name">Shanty Pass Shankers</h2>
          <button
            className="raid-board-admin-button"
            onClick={() => openDropsModal("Complaining Raiders and Ben")}
          >
            Manage Team Drops
          </button>
          <RaidBoard isAdmin={true} teamName="Complaining Raiders and Ben" />
        </div>
      </div>

      {showDropsModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <RaidDrops teamName={dropsTeam} isAdmin={true} />
            <button className="raid-board-admin-button" onClick={closeDropsModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RaidBingoAdmin;
