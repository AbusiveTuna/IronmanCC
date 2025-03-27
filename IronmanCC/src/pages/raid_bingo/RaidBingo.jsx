import React from "react";
import RaidBoard from "./RaidBoard";
import "./RaidBingo.css";

const RaidBingo = () => {
  return (
    <div className="raid-bingo">
      <div className="raid-board-wrapper">
        <h2 className="raid-bingo-team-name">Team A</h2>
        <RaidBoard />
      </div>

      <div className="raid-board-wrapper">
        <h2 className="raid-bingo-team-name">Team B</h2>
        <RaidBoard />
      </div>
    </div>
  );
};

export default RaidBingo;
