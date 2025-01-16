import React from 'react';
import GameTile from './GameTile';
import BoardHeader from './BoardHeader';
import './GameBoard.css';

const GameBoard = ({ tiles }) => {
    const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const columnLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    return (
        <div className="game-board-wrapper">
            <BoardHeader columnLabels={columnLabels} />

            <div className="board-grid">
                {tiles.map((row, rowIndex) => {
                    return (
                        <React.Fragment key={rowIndex}>
                            <div className="label">{row[rowIndex].row}</div>
                            {row.map((col) => {
                                return (
                                    <GameTile
                                        key={col.position}
                                        position={col.position}
                                        hasShip={col.hasShip}
                                        isHit={col.isHit}
                                    />
                                );
                            })}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default GameBoard;