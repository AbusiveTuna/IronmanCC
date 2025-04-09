import React, { useState, useEffect } from 'react';
import currentData from '../buyins/raidBingo2025Buyins.json';
import PlayerPool from './PlayerPool';
import Team from './Team';
import './Draft.css';

const Draft = () => {
  const COMPETITION_ID = 34;

  const [teams, setTeams] = useState([
    { id: 1, name: 'New Purple Order', members: [] },
    { id: 2, name: 'Complaining Raiders and Ben', members: [] },
  ]);

  const [playerPool, setPlayerPool] = useState(currentData);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const loadDraft = async () => {
      try {
        const response = await fetch(
          `https://ironmancc-89ded0fcdb2b.herokuapp.com/raids-bingo-draft/${COMPETITION_ID}`
        );
        if (!response.ok) {
          console.log("No existing draft found, continuing with defaults.");
          return;
        }
        const data = await response.json();

        if (data && data.teams) {
          setTeams(data.teams);
          const usedNames = new Set(
            data.teams.flatMap((t) => t.members.map((m) => m.name))
          );
          const filteredPool = currentData.filter(
            (p) => !usedNames.has(p.name)
          );
          setPlayerPool(filteredPool);
        }
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    };

    loadDraft();
  }, []);

  const handleAddPlayerToTeam = (player, teamId) => {
    setPlayerPool((prevPool) => prevPool.filter((p) => p.name !== player.name));
    setTeams((prevTeams) =>
      prevTeams.map((team) => {
        if (team.id === teamId) {
          return { ...team, members: [...team.members, player] };
        }
        return team;
      })
    );
  };

  const handleRemovePlayerFromTeam = (player, fromTeamId) => {
    setPlayerPool((prevPool) => [...prevPool, player]);
    setTeams((prevTeams) =>
      prevTeams.map((team) => {
        if (team.id === fromTeamId) {
          const updatedMembers = team.members.filter((p) => p.name !== player.name);
          return { ...team, members: updatedMembers };
        }
        return team;
      })
    );
  };

  const handleSaveDraft = async () => {
    try {
      const payload = { competitionId: COMPETITION_ID, teams };
      const response = await fetch(
        'https://ironmancc-89ded0fcdb2b.herokuapp.com/raids-bingo-draft/save',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to save draft:", error.error || response.statusText);
      } else {
        const data = await response.json();
        console.log("Draft saved!", data);
      }
    } catch (err) {
      console.error("Error saving draft:", err);
    }
  };

  const handleResetDraft = () => {
    const confirmed = window.confirm("Are you sure you want to reset the draft?");
    if (!confirmed) return; // If they cancel, do nothing

    setTeams([
      { id: 1, name: 'New Purple Order', members: [] },
      { id: 2, name: 'Complaining Raiders and Ben', members: [] },
    ]);
    setPlayerPool(currentData);
  };

  const handleExportTemple = (teamIndex) => {
    const names = teams[teamIndex].members.map((m) => m.name).join(', ');
    navigator.clipboard
      .writeText(names)
      .then(() => {
        setToastMessage(`Copied to clipboard: ${names}`);
        setTimeout(() => setToastMessage(null), 2000);
      })
      .catch((err) => console.error("Clipboard error:", err));
  };

  if (teams.length < 2) {
    return (
      <div className="draft-wrapper">
        <h1 className="draft-title">Raids Bingo 2025 Draft</h1>
        <p>Not enough teams defined.</p>
      </div>
    );
  }

  return (
    <div className="draft-wrapper">
      {toastMessage && <div className="toast">{toastMessage}</div>}

      <h1 className="draft-title">Raids Bingo 2025 Draft</h1>
      <div className="draft-top-bar">
        <button onClick={handleSaveDraft} className="save-draft-button">
          Save Draft
        </button>
        <button onClick={handleResetDraft} className="save-draft-button" style={{ marginLeft: '1rem' }}>
          Reset Draft
        </button>
      </div>
      <div className="draft-layout">
        <div className="team-wrapper">
          <Team
            team={teams[0]}
            onDropPlayer={handleAddPlayerToTeam}
          />
          <button
            onClick={() => handleExportTemple(0)}
            className="save-draft-button"
          >
            Export for Temple
          </button>
        </div>
        <PlayerPool
          players={playerPool}
          setPlayers={setPlayerPool}
          onDropFromTeam={handleRemovePlayerFromTeam}
        />
        <div className="team-wrapper">
          <Team
            team={teams[1]}
            onDropPlayer={handleAddPlayerToTeam}
          />
          <button
            onClick={() => handleExportTemple(1)}
            className="save-draft-button"
          >
            Export for Temple
          </button>
        </div>
      </div>
    </div>
  );
};

export default Draft;
