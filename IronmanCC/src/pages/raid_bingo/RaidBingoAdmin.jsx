import React from "react";
import RaidBoard from "./RaidBoard";
import "./RaidBingo.css";

const RaidBingoAdmin = () => {
  return (
    <div className="raid-bingo">
      <div className="raid-board-wrapper">
        <h2 className="raid-bingo-team-name">New Purple Order</h2>
        <RaidBoard isAdmin={true} teamName={"New Purple Order"}/>
      </div>

      <div className="raid-board-wrapper">
        <h2 className="raid-bingo-team-name">Complaining Raiders and Ben</h2>
        <RaidBoard isAdmin={true} teamName={"Complaining Raiders and Ben"}/>
      </div>
    </div>
  );
};

export default RaidBingoAdmin;
