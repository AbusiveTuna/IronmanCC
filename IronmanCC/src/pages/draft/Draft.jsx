import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './draft.css';

const BUYINS_URL = 'https://ironmancc-89ded0fcdb2b.herokuapp.com/ironmancc/buyins';
const DRAFT_URL = 'https://ironmancc-89ded0fcdb2b.herokuapp.com/everythingBingo/draft';
const TYPE = 'PLAYER';
const EVENT_NAME = 'everything bingo v2';

const Draft = () => {
  const [buyins, setBuyins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamOne, setTeamOne] = useState([]);
  const [teamTwo, setTeamTwo] = useState([]);
  const [teamThree, setTeamThree] = useState([]);
  const [teamFour, setTeamFour] = useState([]);

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
        if (draftRes.ok) {
          const draftData = await draftRes.json();
          if (draftData?.teams) {
            setTeamOne(draftData.teams.teamOne || []);
            setTeamTwo(draftData.teams.teamTwo || []);
            setTeamThree(draftData.teams.teamThree || []);
            setTeamFour(draftData.teams.teamFour || []);
          }
        }
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

  const draftedNames = useMemo(
    () =>
      [...teamOne, ...teamTwo, ...teamThree, ...teamFour].map((p) =>
        p.name.toLowerCase()
      ),
    [teamOne, teamTwo, teamThree, teamFour]
  );

  const availablePlayers = useMemo(
    () =>
      allPlayers
        .filter((p) => !draftedNames.includes(p.name.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [allPlayers, draftedNames]
  );

  const movePlayer = useCallback((player, dest) => {
    setTeamOne((t) => t.filter((p) => p.name !== player.name));
    setTeamTwo((t) => t.filter((p) => p.name !== player.name));
    setTeamThree((t) => t.filter((p) => p.name !== player.name));
    setTeamFour((t) => t.filter((p) => p.name !== player.name));
    if (dest === 'teamOne') setTeamOne((t) => [...t, player]);
    if (dest === 'teamTwo') setTeamTwo((t) => [...t, player]);
    if (dest === 'teamThree') setTeamThree((t) => [...t, player]);
    if (dest === 'teamFour') setTeamFour((t) => [...t, player]);
  }, []);

  const handleSaveDraft = useCallback(async () => {
    const payload = { teams: { teamOne, teamTwo, teamThree, teamFour } };
    try {
      await fetch(DRAFT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      alert('Draft saved.');
    } catch (err) {
      console.error(err);
      alert('Failed to save draft.');
    }
  }, [teamOne, teamTwo, teamThree, teamFour]);

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
          <DraftTable
            title="Team 1"
            data={teamOne}
            onDrop={(p) => movePlayer(p, 'teamOne')}
          />
          <DraftTable
            title="Team 2"
            data={teamTwo}
            onDrop={(p) => movePlayer(p, 'teamTwo')}
          />
          <DraftTable
            title="Team 3"
            data={teamThree}
            onDrop={(p) => movePlayer(p, 'teamThree')}
          />
          <DraftTable
            title="Team 4"
            data={teamFour}
            onDrop={(p) => movePlayer(p, 'teamFour')}
          />
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