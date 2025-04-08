import React, { useState, useEffect } from "react";
import "./RaidBoard.css";
import BingoTile from "components/tiles/BingoTile";
import raidTiles from "json/RaidTiles.json";
import axios from "axios";

const competitionId = 34;

const RaidBoard = ({ isAdmin, teamName }) => {
  const [completionMap, setCompletionMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await axios.get(
          `https://ironmancc-89ded0fcdb2b.herokuapp.com/raids-bingo`,
          {
            params: {
              team: teamName,
              competitionId,
            },
          }
        );
        setCompletionMap(res.data);
      } catch (err) {
        console.error("Failed to fetch board state:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [teamName]);

  const toggleTile = (tileName, maxCount = 1) => {
    setCompletionMap((prev) => {
      const current = prev[tileName] || 0;
      const next = current >= maxCount ? 0 : current + 1;
      return { ...prev, [tileName]: next };
    });
  };

  const saveBoard = async () => {
    try {
      await axios.post("https://ironmancc-89ded0fcdb2b.herokuapp.com/raids-bingo/save", {
        competitionId,
        team: teamName,
        state: completionMap,
      });
      alert("Board state saved.");
    } catch (err) {
      console.error("Error saving board:", err);
      alert("Failed to save.");
    }
  };

  const rowGroups = [
    [4, 4, 4, 1],
    [4, 4, 3],
    [3, 3, 2],
    [3, 3, 1],
  ];

  const sections = [
    "Chambers of Xeric",
    "Theatre of Blood",
    "Tombs of Amascut",
    "Nex",
  ];

  if (loading) return <div>Loading board for {teamName}...</div>;

  let currentIndex = 0;

  return (
    <div className="raid-board">
      {rowGroups.map((group, sectionIndex) => (
        <div className="raid-section" key={`section-${sectionIndex}`}>
          <div className="raid-section-header">
            <h3>{sections[sectionIndex]}</h3>
            <hr />
          </div>

          {group.map((size, rowIndex) => {
            const rowTiles = raidTiles.slice(currentIndex, currentIndex + size);
            currentIndex += size;

            const rowClass = size === 1 ? "raid-row single-tile-row" : "raid-row";

            return (
              <div className={rowClass} key={`row-${sectionIndex}-${rowIndex}`}>
                {rowTiles.map((tile) => {
                  const maxCount = tile.count || 1;
                  const currentCount = completionMap[tile.name] || 0;
                  const isCompleted = currentCount >= maxCount;

                  return (
                    <BingoTile
                      key={`${teamName}-${tile.name}`}
                      tile={{
                        name: tile.name,
                        IsCompleted: isCompleted,
                        currentCount,
                        maxCount,
                      }}
                      tileMeta={tile}
                      onInfoClick={() => console.log("Info:", tile)}
                      onAdminClick={
                        isAdmin ? () => toggleTile(tile.name, maxCount) : null
                      }
                      size="medium"
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      ))}

      {isAdmin && (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <button className="raid-board-admin-button" onClick={saveBoard}>
            Save Changes for {teamName}
          </button>
        </div>
      )}
    </div>
  );
};

export default RaidBoard;
