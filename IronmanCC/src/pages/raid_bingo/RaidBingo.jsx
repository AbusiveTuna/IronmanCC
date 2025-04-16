import React, { useState } from "react";
import RaidBoard from "./RaidBoard";
import RaidDrops from "./RaidDrops";
import "./RaidBingo.css";

const RaidBingo = () => {
  const [showDrops, setShowDrops] = useState(false);

  return (
    <div className="raid-bingo">
      <div className="raid-bingo-toggle">
        <button className="raid-board-admin-button" onClick={() => setShowDrops(!showDrops)}>
          {showDrops ? "View Boards" : "View Drops"}
        </button>
      </div>

      {!showDrops && (
        <div className="raid-bingo-teams">
          <div className="raid-board-wrapper">
            <h2 className="raid-bingo-team-name">New Purple Order</h2>
            <RaidBoard isAdmin={false} teamName="New Purple Order" />
          </div>

          <div className="raid-board-wrapper">
            <h2 className="raid-bingo-team-name">Shanty Pass Shankers</h2>
            <RaidBoard isAdmin={false} teamName="Complaining Raiders and Ben" />
          </div>
        </div>
      )}

      {showDrops && (
        <div className="raid-bingo-teams">
          <div className="raid-board-wrapper">
            <h2 className="raid-bingo-team-name">New Purple Order - Drops</h2>
            <RaidDrops isAdmin={false} teamName="New Purple Order" />
          </div>

          <div className="raid-board-wrapper">
            <h2 className="raid-bingo-team-name">
              Shanty Pass Shankers - Drops
            </h2>
            <RaidDrops isAdmin={false} teamName="Complaining Raiders and Ben" />
          </div>
        </div>
      )}
    </div>
  );
};

export default RaidBingo;
