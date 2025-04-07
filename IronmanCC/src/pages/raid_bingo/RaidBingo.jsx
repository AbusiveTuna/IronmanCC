import React from "react";
import RaidBoard from "./RaidBoard";
import "./RaidBingo.css";

const RaidBingo = () => {
  return (
    <div className="raid-bingo">
      <div className="raid-board-wrapper">
        <h2 className="raid-bingo-team-name">Team 2F1</h2>
        <RaidBoard isAdmin={false} teamName={"Team 2F1"}/>
      </div>

      <div className="raid-board-wrapper">
        <h2 className="raid-bingo-team-name">Team Ags friend</h2>
        <RaidBoard isAdmin={false} teamName={"Team Ags friend"}/>
      </div>
    </div>
  );
};

export default RaidBingo;
