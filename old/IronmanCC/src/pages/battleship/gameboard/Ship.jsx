import React from "react";
import { useDrag } from "react-dnd";
import "./Ship.css";

const Ship = ({ id, size, direction, rotateShip }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "SHIP",
        item: () => ({ id, size, direction }),
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [direction]);

    return (
        <div
            ref={drag}
            className={`ship ${direction}`}
            style={{
                width: direction === "horizontal" ? `${size * 40}px` : "40px",
                height: direction === "vertical" ? `${size * 40}px` : "40px",
                opacity: isDragging ? 0.5 : 1,
            }}
        >
            <div className="ship-body">{id.toUpperCase()}</div>
            <button className="rotate-btn" onClick={(e) => { 
                e.stopPropagation();
                rotateShip(id);
            }}>
                ⟳
            </button>
        </div>
    );
};

export default Ship;
