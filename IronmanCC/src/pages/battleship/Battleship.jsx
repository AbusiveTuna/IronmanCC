import React, {useState, useEffect} from 'react';
import { Container, Button, Form } from "react-bootstrap";
import ShotInput from './ShotInput';
import Board from "./gameboard/Board";
import "./gameboard/GameBoard.css";
import './Battleship.css';

const fakeData = {
    "gameId": "12345",
    "teamOne": {
      "name": "Team Alpha",
      "captain": "Captain A",
      "board": [
        {"row": 0, "col": 0, "isHit": true},
        {"row": 0, "col": 1, "isHit": true, "hasShip": false},
        {"row": 0, "col": 2, "isHit": true, "hasShip": true}
      ]
    },
    "teamTwo": {
      "name": "Team Bravo",
      "captain": "Captain B",
      "board": [
        {"row": 0, "col": 0, "isHit": true},
        {"row": 0, "col": 1, "isHit": true, "hasShip": false},
        {"row": 0, "col": 2, "isHit": true, "hasShip": true}
      ]
    }
  };  

const Battleship = () => {
    const [gameData, setGameData] = useState(null);
    const [selectedShot, setSelectedShot] = useState(null);
    const [shotCode, setShotCode] = useState("");

    useEffect(() => {
        // const fetchGameData = async () => {
        //     try {
        //         const response = await fetch(`http://your-backend-api.com/game/${gameId}`);
        //         if (!response.ok) {
        //             throw new Error("Failed to fetch game data.");
        //         }
        //         const data = await response.json();
        //         setGameData(data);
        //     } catch (error) {
        //         console.error("Error fetching game data:", error);
        //     }
        // };

        // fetchGameData();
        setGameData(fakeData);
    }, []);

    const handleSelectTile = (row,col) => {
      setSelectedShot({row,col});
    }

    const handleFireShot = (shot) => {
      console.log("Shot fired:", shot);
      setSelectedShot(null);
      // In the future, send this to the backend
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
                      <Board placedShips={gameData.teamOne.board} onSelectTile={handleSelectTile} />
                      <Board placedShips={gameData.teamTwo.board} onSelectTile={handleSelectTile} />
                  </div>
              </div>

              <ShotInput gameData={gameData} onFireShot={handleFireShot} selectedShot={selectedShot} />
          </Container>
      </div>
  );
};

export default Battleship;