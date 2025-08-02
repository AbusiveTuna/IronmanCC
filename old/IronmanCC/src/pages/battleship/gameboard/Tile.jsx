import React from "react";
import { useDrop } from "react-dnd";
import "./Tile.css";

const Tile = ({ row, col, hasShip, isHit, shipHit, placeShip, onSelect, isSelected }) => {
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

    const handleClick =() => {
        if (!placeShip && onSelect) {
            onSelect(row,col);
        }
    };

    return (
        <div
            ref={placeShip ? drop : null}
            className={`tile 
                ${isOver ? "tile-hover" : ""} 
                ${isHit ? (shipHit ? "hit-ship" : "hit-miss") : ""}
                ${placeShip && hasShip ? "occupied" : ""}  // Show ships only in setup mode
                ${isSelected ? "selected-tile" : "" }
            `}
            onClick={handleClick}
        ></div>
    );
};

export default Tile;
