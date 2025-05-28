import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './draft.css';

const BUYINS_URL = 'https://ironmancc-89ded0fcdb2b.herokuapp.com/ironmancc/buyins';
const DRAFT_URL = 'https://ironmancc-89ded0fcdb2b.herokuapp.com/everythingBingo/draft';
const TYPE = 'PLAYER';
const EVENT_NAME = 'everything bingo v2';

const INITIAL_TEAM_NAMES = [
  'Barely Legal Seafood',
  'The Butter Churners',
  'Everything but the Tub',
  'Sophanem Sigmas'
];

const Draft = () => {
  const [buyins, setBuyins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [buyRes, draftRes] = await Promise.all([fetch(BUYINS_URL), fetch(DRAFT_URL)]);
        const buyData = await buyRes.json();
        setBuyins(
          buyData.filter(
            ({ event_name }) => event_name && event_name.toLowerCase() === EVENT_NAME
          )
        );

        const initialTeams = {};
        INITIAL_TEAM_NAMES.forEach((name) => (initialTeams[name] = []));

        if (draftRes.ok) {
          const draftData = await draftRes.json();
          if (draftData?.teams) {
            for (const name of INITIAL_TEAM_NAMES) {
              initialTeams[name] = draftData.teams[name] || [];
            }
          }
        }
        setTeams(initialTeams);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const allPlayers = useMemo(() => {
    const names = new Set(
      buyins.map(({ player_name }) => player_name.trim().toLowerCase())
    );
    return [...names].map((n) => ({ name: n }));
  }, [buyins]);

  const draftedNames = useMemo(() => {
    return Object.values(teams).flat().map((p) => p.name.toLowerCase());
  }, [teams]);

  const availablePlayers = useMemo(() => {
    return allPlayers
      .filter((p) => !draftedNames.includes(p.name.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [allPlayers, draftedNames]);

  const movePlayer = useCallback((player, destTeam) => {
    setTeams((prev) => {
      const updated = {};
      for (const [teamName, members] of Object.entries(prev)) {
        updated[teamName] = members.filter((p) => p.name !== player.name);
      }
      if (destTeam && updated[destTeam]) {
        updated[destTeam] = [...updated[destTeam], player];
      }
      return updated;
    });
  }, []);

  const handleSaveDraft = useCallback(async () => {
    try {
      await fetch(DRAFT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teams }),
      });
      alert('Draft saved.');
    } catch (err) {
      console.error(err);
      alert('Failed to save draft.');
    }
  }, [teams]);

  if (loading) return <div className="draft-container">Loading…</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="draft-container">
        <h1 className="d-h1">Draft</h1>
        <button className="d-save-btn" onClick={handleSaveDraft}>
          Save Draft
        </button>
        <div className="d-tables-container">
          <DraftTable
            title="Available Players"
            data={availablePlayers}
            onDrop={(p) => movePlayer(p, null)}
          />
          {Object.entries(teams).map(([teamName, members]) => (
            <DraftTable
              key={teamName}
              title={teamName}
              data={members}
              onDrop={(p) => movePlayer(p, teamName)}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};


const DraftTable = ({ title, data, onDrop }) => {
  const [, drop] = useDrop(
    () => ({ accept: TYPE, drop: (item) => onDrop(item.player) }),
    [onDrop]
  );

  const handleCopy = () => {
    const names = data.map((p) => p.name).join(', ');
    navigator.clipboard.writeText(names).then(() => {
      console.log(`Copied ${title} names to clipboard`);
    });
  };

  return (
    <div ref={drop} className="d-table-container">
      <div className="d-table-header">
        <h2 className="d-h2">{title}</h2>
        <button className="d-copy-btn" onClick={handleCopy}>
          Copy Names
        </button>
      </div>
      <table className="d-table">
        <thead className="d-thead">
          <tr className="d-tr">
            <th className="d-th">Name</th>
          </tr>
        </thead>
        <tbody className="d-tbody">
          {data.map((player) => (
            <DraggableRow key={player.name} player={player} />
          ))}
        </tbody>
      </table>
    </div>
  );
};


const DraggableRow = ({ player }) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: TYPE,
      item: { player },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
    [player]
  );
  return (
    <tr ref={drag} className="d-tr" style={{ opacity: isDragging ? 0.5 : 1 }}>
      <td className="d-td">{player.name}</td>
    </tr>
  );
};

export default Draft;