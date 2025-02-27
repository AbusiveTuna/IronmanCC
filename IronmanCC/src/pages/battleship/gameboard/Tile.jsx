import React from "react";
import { useDrop } from "react-dnd";
import "./GameBoard.css";

const Tile = ({ row, col, hasShip, isHit, placeShip }) => {
    const [{ isOver, canDrop }, drop] = useDrop(
        () => ({
            accept: "SHIP",
            drop: (item) => {
                if (placeShip) {
                    placeShip(item, row, col);
                }
            },
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
                canDrop: !!monitor.canDrop(),
            }),
        }),
        [placeShip]
    );

    return (
        <div
            ref={placeShip ? drop : null}
            className={`tile 
                ${isOver ? "tile-hover" : ""} 
                ${isHit ? (hasShip ? "hit-ship" : "hit-miss") : ""}
                ${placeShip && hasShip ? "occupied" : ""}  // Show ships only in setup mode
            `}
        ></div>
    );
};

export default Tile;
