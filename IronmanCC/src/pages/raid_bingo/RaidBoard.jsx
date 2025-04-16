import React, { useState, useEffect } from "react";
import "./RaidBoard.css";
import BingoTile from "components/tiles/BingoTile";
import raidTiles from "json/RaidTiles.json";
import axios from "axios";

const COMPETITION_ID = 34;

const RaidBoard = ({ isAdmin, teamName }) => {
  const [completionMap, setCompletionMap] = useState({});
  const [pendingDrops, setPendingDrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTile, setSelectedTile] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await axios.get(
          "https://ironmancc-89ded0fcdb2b.herokuapp.com/raids-bingo",
          {
            params: {
              team: teamName,
              competitionId: COMPETITION_ID,
            },
          }
        );
        setCompletionMap(res.data);
      } catch {
        // no-op
      }
      setLoading(false);
    };
    const loadDraft = async () => {
      try {
        const response = await fetch(
          `https://ironmancc-89ded0fcdb2b.herokuapp.com/raids-bingo-draft/${COMPETITION_ID}`
        );
        if (!response.ok) return;
        const data = await response.json();
        if (data && data.teams) setTeams(data.teams);
      } catch {
        // no-op
      }
    };
    fetchBoard();
    loadDraft();
  }, [teamName]);

  const toggleTile = (tileName, maxCount = 1) => {
    setCompletionMap((prev) => {
      const current = prev[tileName] || 0;
      const next = current + 1;
      return { ...prev, [tileName]: next };
    });
  };

  const handleTileRightClick = (tile, event) => {
    event.preventDefault();
    setCompletionMap((prev) => {
      const current = prev[tile.name] || 0;
      const next = current > 0 ? current - 1 : 0;
      return { ...prev, [tile.name]: next };
    });

    setPendingDrops((prev) => {
      const index = [...prev].reverse().findIndex(
        (d) => d.tileName === tile.name && d.teamName === teamName
      );
      if (index === -1) return prev;
      const trueIndex = prev.length - 1 - index;
      return [...prev.slice(0, trueIndex), ...prev.slice(trueIndex + 1)];
    });
  };

  const handleAdminTileClick = (tile) => {
    setSelectedTile(tile);
    setShowModal(true);
  };

  const confirmDropSelection = () => {
    if (!selectedTile || !selectedPlayer) return;
    const { name, count: maxCount } = selectedTile;
    toggleTile(name, maxCount || 1);
    setPendingDrops((prev) => [
      ...prev,
      {
        tileName: selectedTile.name,
        playerName: selectedPlayer,
        teamName,
        competitionId: COMPETITION_ID,
      },
    ]);
    setShowModal(false);
    setSelectedTile(null);
    setSelectedPlayer("");
  };

  const saveBoard = async () => {
    try {
      await axios.post(
        "https://ironmancc-89ded0fcdb2b.herokuapp.com/raids-bingo/save",
        {
          competitionId: COMPETITION_ID,
          team: teamName,
          state: completionMap,
        }
      );

      if (pendingDrops.length > 0) {
        for (const drop of pendingDrops) {
          await axios.post(
            "https://ironmancc-89ded0fcdb2b.herokuapp.com/save-raids-bingo-drops",
            drop
          );
        }
        setPendingDrops([]);
      }

      alert("Board state and drops saved.");
    } catch {
      alert("Failed to save.");
    }
  };

  const rowGroups = [
    [4, 4, 4, 2],
    [4, 4, 3],
    [3, 3, 3],
    [3, 3, 1],
  ];

  const sections = [
    "Chambers of Xeric",
    "Theatre of Blood",
    "Tombs of Amascut",
    "Nex",
  ];

  const currentTeam = teams.find((t) => t.name === teamName);
  const teamMembers = currentTeam?.members
    ? [...currentTeam.members].sort((a, b) =>
      a.name.localeCompare(b.name)
    )
    : [];

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
            const rowClass =
              size === 1 ? "raid-row single-tile-row" : "raid-row";
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
                      onInfoClick={() => { }}
                      onAdminClick={
                        isAdmin
                          ? () => handleAdminTileClick(tile)
                          : null
                      }
                      onContextMenu={
                        isAdmin
                          ? (event) => handleTileRightClick(tile, event)
                          : null
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
      {isAdmin && showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Select who got the drop:</h3>
            <select
              value={selectedPlayer}
              onChange={(e) => setSelectedPlayer(e.target.value)}
            >
              <option value="">-- Pick a member --</option>
              {teamMembers.map((member) => (
                <option key={member.name} value={member.name}>
                  {member.name}
                </option>
              ))}
            </select>
            <div className="modal-buttons">
              <button onClick={confirmDropSelection}>Confirm</button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedTile(null);
                  setSelectedPlayer("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RaidBoard;
