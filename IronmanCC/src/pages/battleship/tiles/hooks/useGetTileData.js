import { useState, useEffect } from "react";

const useTileData = (teamName, compId) => {
  const [tileData, setTileData] = useState(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await fetch(
          `https://ironmancc-89ded0fcdb2b.herokuapp.com/battleship-tiles?teamName=${teamName}&compId=${compId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch game data.");
        }
        const data = await response.json();
        setTileData(data);
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    };

    if (teamName && compId) {
      fetchGameData();
    }
  }, [teamName, compId]);

  return [tileData, setTileData];
};

export default useTileData;
