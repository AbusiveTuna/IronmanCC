import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import Board from './gameboard/Board';
import Ship from './gameboard/Ship';
import './gameboard/GameBoard.css';

const BoardSetup = () => {
    const { captainId } = useParams();

    const [ships, setShips] = useState([
        { id: 'carrier', size: 5, direction: 'horizontal' },
        { id: 'battleship', size: 4, direction: 'horizontal' },
        { id: 'cruiser', size: 3, direction: 'horizontal' },
        { id: 'submarine', size: 3, direction: 'horizontal' },
        { id: 'destroyer', size: 2, direction: 'horizontal' },
    ]);

    const [placedShips, setPlacedShips] = useState([]);

    const allShipsPlaced = ships.length === 0;

    const rotateShip = (id) => {
        setShips((prevShips) =>
            prevShips.map((ship) =>
                ship.id === id
                    ? { ...ship, direction: ship.direction === "horizontal" ? "vertical" : "horizontal" }
                    : ship
            )
        );
    };

    const handleShipPlaced = (ship, row, col) => {
        setPlacedShips((prev) => {
            if (!isValidPlacement(ship, row, col, prev)) {
                return prev;
            }    

            let newShipTiles = [];
            for (let i = 0; i < ship.size; i++) {
                let newRow = ship.direction === "horizontal" ? row : row + i;
                let newCol = ship.direction === "horizontal" ? col + i : col;
                newShipTiles.push({ row: newRow, col: newCol, id: ship.id });
            }

            const updatedShips = [...prev, ...newShipTiles];

            setShips((prevShips) => prevShips.filter((s) => s.id !== ship.id));

            return updatedShips;
        });
    };

    const isValidPlacement = (ship, row, col, ships) => {
        for (let i = 0; i < ship.size; i++) {
            let checkRow = ship.direction === "horizontal" ? row : row + i;
            let checkCol = ship.direction === "horizontal" ? col + i : col;

            if (checkRow >= 10 || checkCol >= 10) {
                return false;
            }

            if (ships.some((tile) => tile.row === checkRow && tile.col === checkCol)) {
                return false;
            }
        }
        return true;
    };

    const saveShipPlacement = async () => {
        const boardData = {
            captainId,
            placedShips
        };

        console.log("Sending board data to backend:", boardData);

        // try {
        //     const response = await fetch("http://your-backend-api.com/saveBoard", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json"
        //         },
        //         body: JSON.stringify(boardData)
        //     });

        //     if (!response.ok) {
        //         throw new Error("Failed to save board placement.");
        //     }

        //     const data = await response.json();
        //     console.log("Board saved successfully:", data);
        // } catch (error) {
        //     console.error("Error saving board placement:", error);
        // }
    };

    return (
        <div className='board-setup'>
        <Container className="mt-4">
          <h2>Game Setup</h2>
          <p>Welcome Captain {captainId}, please configure your game setup.</p>

          <div className="ship-selection">
              {ships.map((ship) => (
                  <Ship
                      key={ship.id}
                      id={ship.id}
                      size={ship.size}
                      direction={ship.direction}
                      rotateShip={() => rotateShip(ship.id)}
                  />
              ))}
          </div>

          <Board placedShips={placedShips} placeShip={handleShipPlaced} />

          {allShipsPlaced && (
              <Button variant="success" onClick={saveShipPlacement}>
                  Save Ship Placement
              </Button>
          )}

        </Container>
        </div>
    );
};

export default BoardSetup;
