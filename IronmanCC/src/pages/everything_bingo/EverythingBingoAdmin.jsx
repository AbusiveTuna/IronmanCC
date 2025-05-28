import React, { useState, useEffect } from 'react';
import categories from './Categories.json';

const CURRENT_EVENT_NAME = 'everything bingo v2';
const API_ROOT = 'https://ironmancc-89ded0fcdb2b.herokuapp.com/everythingBingo';
const DRAFT_URL ='https://ironmancc-89ded0fcdb2b.herokuapp.com/everythingBingo/draft';

const EverythingBingoAdmin = () => {
  const [teamsData, setTeamsData]     = useState({});
  const [teamNames, setTeamNames]     = useState([]);
  const [players, setPlayers]         = useState([]);
  const [entries, setEntries]         = useState([]);

  const [selectedTeam, setSelectedTeam]         = useState('');
  const [selectedPlayer, setSelectedPlayer]     = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [inputValue, setInputValue]             = useState('');
  const [status, setStatus]                     = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(DRAFT_URL);
        if (!res.ok) return;
        const data = await res.json();
        console.log(data);
        if (data?.teams) {
          setTeamsData(data.teams);
          setTeamNames(Object.keys(data.teams).sort());
        }
      } catch (err) {
        console.error('Failed to fetch draft:', err);
      }
    })();
  }, []);

  const refreshEntries = async () => {
    try {
      const res = await fetch(`${API_ROOT}/entries?event_name=${encodeURIComponent(CURRENT_EVENT_NAME)}`);
      if (res.ok) setEntries(await res.json());
    } catch (err) {
      console.error('Failed to fetch entries:', err);
    }
  };
  useEffect(() => { refreshEntries(); }, []);

  useEffect(() => {
    if (selectedTeam && teamsData[selectedTeam]) {
      const sorted = teamsData[selectedTeam]
        .map((p) => p.name)
        .sort((a, b) => a.localeCompare(b));
      setPlayers(sorted);
    } else {
      setPlayers([]);
    }
    setSelectedPlayer('');
  }, [selectedTeam, teamsData]);

  const soloCats   = categories.filter((c) => c.Type === 'Solo');
  const teamCats   = categories.filter((c) => c.Type === 'Team');
  const purpleCats = categories.filter((c) => c.Type === 'Purples');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlayer || !selectedTeam || !selectedCategory || !inputValue.trim()) {
      setStatus('All fields required');
      return;
    }
    try {
      const res = await fetch(`${API_ROOT}/entries`, {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({
          player_name: selectedPlayer,
          team_name  : selectedTeam,
          category   : selectedCategory,
          event_name : CURRENT_EVENT_NAME,
          entry      : inputValue.trim(),
        }),
      });
      if (res.ok) {
        setStatus('Entry submitted!');
        setInputValue('');
        setSelectedCategory('');
        setSelectedPlayer('');
        setSelectedTeam('');
        refreshEntries();
      } else {
        setStatus('Submission failed');
      }
    } catch {
      setStatus('Request error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      const res = await fetch(`${API_ROOT}/entries/${id}`, { method: 'DELETE' });
      if (res.ok) refreshEntries();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const catSelect = (label, items) => (
    <select
      value={items.find((c) => c.name === selectedCategory)?.name || ''}
      onChange={(e) => setSelectedCategory(e.target.value)}
      className="buyin-input"
    >
      <option value="">{`-- ${label} --`}</option>
      {items.map((c) => (
        <option key={c.name} value={c.name}>{c.name}</option>
      ))}
    </select>
  );

  return (
    <div className="buyins-wrapper">
      <div className="buyins-column full">
        <div className="buyins-section">
          <h2>Everything Bingo Admin Panel</h2>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <div>
              <label>Team & Player:</label>
              <div style={{ display:'flex', gap:'12px' }}>
                <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)} className="buyin-input">
                  <option value="">-- Select Team --</option>
                  {teamNames.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>

                <select value={selectedPlayer} onChange={(e) => setSelectedPlayer(e.target.value)} className="buyin-input">
                  <option value="">-- Select Player --</option>
                  {players.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label>Category:</label>
              <div style={{ display:'flex', gap:'12px' }}>
                {catSelect('Solo',   soloCats)}
                {catSelect('Team',   teamCats)}
                {catSelect('Purples', purpleCats)}
              </div>
            </div>

            <div>
              <label>Entry:</label>
              <input
                type="text"
                placeholder="e.g. 21:42, 450 invo, Purple"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="buyin-input"
              />
            </div>

            <button type="submit" className="buyin-submit-button">Submit Entry</button>
            {status && <p style={{ textAlign:'center', color: status.includes('submitted') ? '#33ff66' : '#ff6666' }}>{status}</p>}
          </form>

          <h3 style={{ marginTop:'32px' }}>Existing Entries</h3>
          {entries.length === 0 ? (
            <p>No entries yet.</p>
          ) : (
            <table className="custom-table" style={{ width:'100%' }}>
              <thead>
                <tr>
                  <th>ID</th><th>Player</th><th>Team</th><th>Category</th>
                  <th>Entry</th><th></th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id}>
                    <td>{e.id}</td>
                    <td>{e.player_name}</td>
                    <td>{e.team_name}</td>
                    <td>{e.category}</td>
                    <td>{e.entry}</td>
                    <td>
                      <button
                        className="buyin-submit-button"
                        style={{ padding:'4px 8px' }}
                        onClick={() => handleDelete(e.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default EverythingBingoAdmin;
