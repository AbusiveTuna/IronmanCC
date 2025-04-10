import React from "react";
import RaidBoard from "./RaidBoard";
import "./RaidBingo.css";

const RaidBingo = () => {
  return (
    <div className="raid-bingo">
      <div className="raid-board-wrapper">
        <h2 className="raid-bingo-team-name">New Purple Order</h2>
        <RaidBoard isAdmin={false} teamName={"New Purple Order"}/>
      </div>

      <div className="raid-board-wrapper">
        <h2 className="raid-bingo-team-name">Shanty Pass Shanker</h2>
        <RaidBoard isAdmin={false} teamName={"Complaining Raiders and Ben"}/>
      </div>
    </div>
  );
};

export default RaidBingo;
