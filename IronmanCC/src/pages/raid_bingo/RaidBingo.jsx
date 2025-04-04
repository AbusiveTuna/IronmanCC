import React from "react";
import RaidBoard from "./RaidBoard";
import "./RaidBingo.css";

const RaidBingo = () => {
  return (
    <div className="raid-bingo">
      <div className="raid-board-wrapper">
        <h2 className="raid-bingo-team-name">Team Tuna</h2>
        <RaidBoard isAdmin={false} teamName={"team tuna"}/>
      </div>

      <div className="raid-board-wrapper">
        <h2 className="raid-bingo-team-name">Team Goose</h2>
        <RaidBoard isAdmin={false} teamName={"team goose"}/>
      </div>
    </div>
  );
};

export default RaidBingo;
