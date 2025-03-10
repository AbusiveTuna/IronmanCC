import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

const OSRSTiles = () => {
    const [tileData, setTileData] = useState(null);
    const [shotsTaken, setShotsTaken] = useState(0);

    const { captainId } = useParams();
    // const [captainName, compId] = captainId.split("-");

    //data call to the backend.
    //simply gets something that tells us out of the 100 tiles, which ones are crossed off, and how many to reveal.

    const fetchGameData = async () => {
        try {
            const response = await fetch(`https://ironmancc-89ded0fcdb2b.herokuapp.com/battleship-game/${gameId}`);
            if (!response.ok) throw new Error("Failed to fetch game data.");
            const data = await response.json();
            setTileData(data);
        } catch (error) {
            console.error("Error fetching game data:", error);
        }
    };

    useEffect(() => {
        fetchGameData();
    }, []);

    //Have all 100 tiles laid out.
    //From the data, X out ones already completed.
    //Thats it?

    return (
        <div>

        </div>
    );
}

export default OSRSTiles;
