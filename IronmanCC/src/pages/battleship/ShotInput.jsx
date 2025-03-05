import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "./ShotInput.css";

const ShotInput = ({ gameData, onFireShot, selectedShot }) => {
    const [selectedBoard, setSelectedBoard] = useState("");
    const [shotCode, setShotCode] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleFireShot = () => {
        if (!selectedBoard) {
            setErrorMessage("Select a team to fire at.");
            return;
        }

        if (!shotCode) {
            setErrorMessage("Enter a valid shot code.");
            return;
        }

        if (!selectedShot) {
            setErrorMessage("Select a tile on the enemy board.");
            return;
        }

        onFireShot({
            board: selectedBoard,
            row: selectedShot.row,
            col: selectedShot.col,
            shotCode
        });

        setShotCode("");
        setErrorMessage("");
    };

    return (
        <div className="shot-input">
            <h2 className="shot-title">Fire Your Shot</h2>
            <p className="shot-instructions">
                Select the enemy team, enter your shot code, and choose a target tile.
            </p>

            <Form.Group className="shot-form-group">
                <Form.Label>Target Team</Form.Label>
                <Form.Select
                    value={selectedBoard}
                    onChange={(e) => setSelectedBoard(e.target.value)}
                    className="shot-select"
                >
                    <option value="" disabled>Select a team</option>
                    <option value="teamOne"> {gameData.teamOne.name} </option>
                    <option value="teamTwo"> {gameData.teamTwo.name} </option>
                </Form.Select>
            </Form.Group>

            <Form.Group className="shot-form-group">
                <Form.Label>Shot Code</Form.Label>
                <Form.Control
                    type="text"
                    value={shotCode}
                    onChange={(e) => setShotCode(e.target.value)}
                    placeholder="Enter your shot code"
                    className="shot-input-box"
                />
            </Form.Group>

            {selectedShot && (
                <p className="si-selected-tile">
                    Targeting <strong>{String.fromCharCode(65 + selectedShot.row)}{selectedShot.col + 1}</strong> on <strong>{selectedBoard === "teamOne" ? gameData.teamOne.name : gameData.teamTwo.name}</strong>'s board.
                </p>
            )}

            <Button
                className="fire-button"
                onClick={handleFireShot}
                disabled={!shotCode || !selectedShot || !selectedBoard}
            >
                FIRE!
            </Button>

            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default ShotInput;
