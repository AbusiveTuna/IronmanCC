import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import ShotInput from "./ShotInput";
import Board from "./gameboard/Board";
import "./gameboard/Board.css";
import "./Battleship.css";

const gameId = 2;

const Battleship = () => {
    const [gameData, setGameData] = useState(null);
    const [selectedShot, setSelectedShot] = useState(null);
    const [selectedBoard, setSelectedBoard] = useState(null);

    const fetchGameData = async () => {
        try {
            const response = await fetch(`https://ironmancc-89ded0fcdb2b.herokuapp.com/battleship-game/${gameId}`);
            if (!response.ok) throw new Error("Failed to fetch game data.");
            const data = await response.json();
            setGameData(data);
        } catch (error) {
            console.error("Error fetching game data:", error);
        }
    };

    useEffect(() => {
        fetchGameData();
    }, []);

    const handleSelectTile = (row, col, board) => {
        setSelectedShot({ row, col });
        setSelectedBoard(board);
    };

    const handleFireShot = async ({ board, row, col, shotCode }) => {
      if (!gameData) {
          console.error("Game data is not available.");
          return;
      }
  
      const targetTeam = board === "teamOne" ? gameData.teamOne.name : gameData.teamTwo.name;

      try {
          const response = await fetch("https://ironmancc-89ded0fcdb2b.herokuapp.com/battleship-fire-shot", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  compId: gameId,
                  team: targetTeam,
                  row,
                  col,
                  shotCode,
              }),
          });
  
          const data = await response.json();
          if (!response.ok) {
              console.error("Shot failed:", data.error);
              return;
          }
  
          console.log("Shot successful:", data);
          fetchGameData(); 
      } catch (error) {
          console.error("Error firing shot:", error);
      }
  };

    if (!gameData) return <div>Loading game...</div>;

    return (
        <div className="Battleship-Bingo">
            <Container className="game-container">
                <div className="board-section">
                    <div className="team-headers">
                        <h3>{gameData.teamOne.name} (Captain {gameData.teamOne.captain})</h3>
                        <h3>{gameData.teamTwo.name} (Captain {gameData.teamTwo.captain})</h3>
                    </div>

                    <div className="board-wrapper">
                        <Board placedShips={gameData.teamOne.board} onSelectTile={(row,col)=> handleSelectTile(row,col,"one")} selectedShot={selectedShot} selectedBoard={selectedBoard} team={'one'}/>
                        <Board placedShips={gameData.teamTwo.board} onSelectTile={(row,col)=> handleSelectTile(row,col,"two")} selectedShot={selectedShot} selectedBoard={selectedBoard} team={'two'}/>
                    </div>
                </div>

                <ShotInput gameData={gameData} onFireShot={handleFireShot} selectedShot={selectedShot} selectedBoard={selectedBoard}/>
            </Container>
        </div>
    );
};

export default Battleship;
