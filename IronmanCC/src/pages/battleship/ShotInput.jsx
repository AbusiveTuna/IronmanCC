import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const ShotInput = ({ gameData, onFireShot, selectedShot }) => {
    const [selectedBoard, setSelectedBoard] = useState("");
    const [shotCode, setShotCode] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleFireShot = () => {

        if(!selectedBoard){
            setErrorMessage("Select a board to fire at.");
        }

        if (!shotCode) {
            setErrorMessage("Enter a valid shot code.");
            return;
        }

        if (!selectedShot) {
            setErrorMessage("Select a tile to fire at.");
            return;
        }

        console.log(`Firing at ${selectedShot.row},${selectedShot.col} on ${selectedBoard}`);
        console.log(`Shot Code: ${shotCode}`);

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
            <Form.Group>
                <Form.Label>Select Board</Form.Label>
                <Form.Select
                    value={selectedBoard}
                    onChange={(e) => setSelectedBoard(e.target.value)}
                >
                    <option value="" disabled>Select a team</option>
                    <option value="teamOne">{gameData.teamOne.name}</option>
                    <option value="teamTwo">{gameData.teamTwo.name}</option>
                </Form.Select>
            </Form.Group>

            <Form.Group>
                <Form.Label>Enter Shot Code</Form.Label>
                <Form.Control
                    type="text"
                    value={shotCode}
                    onChange={(e) => setShotCode(e.target.value)}
                    placeholder="Enter shot code"
                />
            </Form.Group>

            {selectedShot && (
                <p>Selected Tile: {String.fromCharCode(65 + selectedShot.row)}{selectedShot.col + 1}</p>
            )}

            <Button
                variant="primary"
                onClick={handleFireShot}
                disabled={!shotCode || !selectedShot}
            >
                Fire Shot
            </Button>

            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default ShotInput;
