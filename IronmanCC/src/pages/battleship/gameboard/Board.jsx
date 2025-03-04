import React from "react";
import Tile from "./Tile";
import "./GameBoard.css";

const Board = ({ placedShips, placeShip, onSelectTile }) => {
    const columns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

    return (
        <div className="board-container">
            <div className="battleship-board">
                <div className="board-header-row">
                    <div className="board-corner"></div>
                    {columns.map((col) => (
                        <div key={col} className="board-column-header">{col}</div>
                    ))}
                </div>

                {rows.map((row, rowIndex) => (
                    <div key={row} className="board-row">
                        <div className="board-row-header">{row}</div>
                        {columns.map((col, colIndex) => {
                            const tile = placedShips.find(
                                (t) => t.row === rowIndex && t.col === colIndex
                            );

                            return (
                                <Tile
                                    key={`${row}${col}`}
                                    row={rowIndex}
                                    col={colIndex}
                                    hasShip={placeShip ? !!tile : tile?.isHit && tile?.hasShip}
                                    isHit={tile?.isHit || false}
                                    shipHit={tile?.hitShip || false}
                                    placeShip={placeShip}
                                    onSelect={onSelectTile}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Board;



