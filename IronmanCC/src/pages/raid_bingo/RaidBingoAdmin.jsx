import React from "react";
import RaidBoard from "./RaidBoard";
import "./RaidBingo.css";

const RaidBingoAdmin = () => {
  return (
    <div className="raid-bingo">
      <div className="raid-board-wrapper">
        <h2 className="raid-bingo-team-name">Team Tuna</h2>
        <RaidBoard isAdmin={true} teamName={"team tuna"}/>
      </div>

      <div className="raid-board-wrapper">
        <h2 className="raid-bingo-team-name">Team Goose</h2>
        <RaidBoard isAdmin={true} teamName={"team goose"}/>
      </div>
    </div>
  );
};

export default RaidBingoAdmin;
