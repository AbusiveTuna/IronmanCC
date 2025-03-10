import React, { useState, useEffect } from "react";
import ShotErrorModal from "./ShotErrorModal";
import ShotInput from "./ShotInput";
import Board from "./gameboard/Board";
import "./gameboard/Board.css";
import "./Battleship.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const gameId = 2;

const Battleship = () => {
    const [gameData, setGameData] = useState(null);
    const [selectedShot, setSelectedShot] = useState(null);
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [showErrorModal, setShowErrorModal] = useState(false);

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
            setErrorMessage("Game data is not available.");
            setShowErrorModal(true);
            return;
        }

        const targetTeam = board === "one" ? gameData.teamOne.name : gameData.teamTwo.name;

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
                setErrorMessage(data.error || "Shot failed. Please try again.");
                setShowErrorModal(true);
                return;
            }

            setErrorMessage("");
            setShowErrorModal(false);
            fetchGameData();
        } catch (error) {
            setErrorMessage("Error firing shot. Please check your connection.");
            setShowErrorModal(true);
        }
    };

    if (!gameData) {
        return <div>Loading game...</div>;
    }

    return (
        <div className="Battleship-Bingo">
            <div className="board-section">
                <div className="team-info">
                    <span className="team-label">Captain:</span> {gameData.teamOne.captain}
                    <br />
                    <span className="team-label">Team:</span> {gameData.teamOne.name}
                </div>
                <Board
                    placedShips={gameData.teamOne.board}
                    onSelectTile={(r, c) => handleSelectTile(r, c, "one")}
                    selectedShot={selectedShot}
                    selectedBoard={selectedBoard}
                    team="one"
                />
            </div>

            <div className="board-section">
                <div className="team-info">
                    <span className="team-label">Captain:</span> {gameData.teamTwo.captain}
                    <br />
                    <span className="team-label">Team:</span> {gameData.teamTwo.name}
                </div>
                <Board
                    placedShips={gameData.teamTwo.board}
                    onSelectTile={(r, c) => handleSelectTile(r, c, "two")}
                    selectedShot={selectedShot}
                    selectedBoard={selectedBoard}
                    team="two"
                />
            </div>

            <div className="shot-input-container">
                <ShotInput
                    gameData={gameData}
                    onFireShot={handleFireShot}
                    selectedShot={selectedShot}
                    selectedBoard={selectedBoard}
                    setSelectedBoard={setSelectedBoard}
                />
            </div>

            <ShotErrorModal
                showErrorModal={showErrorModal}
                setShowErrorModal={setShowErrorModal}
                errorMessage={errorMessage}
            />
        </div>
    );
};

export default Battleship;
