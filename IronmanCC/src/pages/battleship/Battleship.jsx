import React, {useState, useEffect} from 'react';
import { Container, Button, Form } from "react-bootstrap";
import Board from "./gameboard/Board";
import "./gameboard/GameBoard.css";
import './Battleship.css';

const fakeData = {
    "gameId": "12345",
    "teamOne": {
      "name": "Team Alpha",
      "captain": "Captain A",
      "board": [
        {"row": 0, "col": 0, "isHit": false},
        {"row": 0, "col": 1, "isHit": true, "hasShip": false},
        {"row": 0, "col": 2, "isHit": true, "hasShip": true}
      ]
    },
    "teamTwo": {
      "name": "Team Bravo",
      "captain": "Captain B",
      "board": [
        {"row": 0, "col": 0, "isHit": false},
        {"row": 0, "col": 1, "isHit": true, "hasShip": false},
        {"row": 0, "col": 2, "isHit": true, "hasShip": true}
      ]
    }
  };  

const Battleship = () => {
    const [gameData, setGameData] = useState(null);
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

    if (!gameData) return <div>Loading game...</div>;

    return (
        <div className="Battleship-Bingo">
        <Container className="mt-4 game-container">
            <h2>Battleship Game</h2>
            <div className="team-headers">
                <h3>{gameData.teamOne.name} (Captain {gameData.teamOne.captain})</h3>
                <h3>{gameData.teamTwo.name} (Captain {gameData.teamTwo.captain})</h3>
            </div>

            <div className="board-display">
                <Board placedShips={gameData.teamOne.board} />
                <Board placedShips={gameData.teamTwo.board} />
            </div>

        </Container>
        </div>
    );
};

export default Battleship;