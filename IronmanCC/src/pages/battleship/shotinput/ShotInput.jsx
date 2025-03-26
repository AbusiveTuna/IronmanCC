import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "./ShotInput.css";

const ShotInput = ({ gameData, onFireShot, selectedShot, selectedBoard }) => {
    const [shotCode, setShotCode] = useState("");

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
    };

    return (
        <div className="shot-input">
            <h2 className="shot-input-title">Fire Your Shot</h2>
            <p className="shot-input-instructions">
                Select the enemy team, enter your shot code, and choose a target tile.
            </p>
            <Form.Group className="shot-input-form-group">
                <Form.Label>Target Team</Form.Label>
                <p className="shot-input-target-team-display">
                    {selectedBoard === "one" ? gameData.teamOne.name : gameData.teamTwo.name}
                </p>
            </Form.Group>


            <Form.Group className="shot-input-form-group">
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
                <p className="shot-input-selected-tile">
                    Targeting <strong>{String.fromCharCode(65 + selectedShot.row)}{selectedShot.col + 1}</strong> on <strong>{selectedBoard === "one" ? gameData.teamOne.name : gameData.teamTwo.name}</strong>'s board.
                </p>
            )}

            <Button
                className="shot-input-fire-button"
                onClick={handleFireShot}
                disabled={!shotCode || !selectedShot || !selectedBoard}
            >
                FIRE!
            </Button>

        </div>
    );
};

export default ShotInput;
