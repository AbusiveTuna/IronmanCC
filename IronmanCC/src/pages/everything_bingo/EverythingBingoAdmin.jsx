import React, { useState, useEffect } from 'react';
import categories from './Categories.json';

const CURRENT_EVENT_NAME = 'everything bingo v2';
const DRAFT_URL =
  'https://ironmancc-89ded0fcdb2b.herokuapp.com/everythingBingo/draft';

const EverythingBingoAdmin = () => {
  const [teamsData, setTeamsData] = useState({});
  const [teamNames, setTeamNames] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchDraft = async () => {
      try {
        const res = await fetch(DRAFT_URL);
        if (!res.ok) return;
        const data = await res.json();
        if (data?.teams) {
          setTeamsData(data.teams);
          setTeamNames(Object.keys(data.teams).sort());
        }
      } catch (err) {
        console.error('Failed to fetch draft:', err);
      }
    };
    fetchDraft();
  }, []);

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

  const soloCats = categories.filter((c) => c.Type === 'Solo');
  const teamCats = categories.filter((c) => c.Type === 'Team');
  const purpleCats = categories.filter((c) => c.Type === 'Purples');

  const handleCategoryChange = (val) => setSelectedCategory(val);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlayer || !selectedTeam || !selectedCategory || !inputValue.trim()) {
      setStatus('All fields required');
      return;
    }
    const payload = {
      player_name: selectedPlayer,
      team_name: selectedTeam,
      category: selectedCategory,
      event_name: CURRENT_EVENT_NAME,
      entry: inputValue.trim(),
    };
    try {
      const res = await fetch(
        'https://ironmancc-89ded0fcdb2b.herokuapp.com/everythingBingo/entries',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      if (res.ok) {
        setStatus('Entry submitted!');
        setInputValue('');
        setSelectedCategory('');
        setSelectedPlayer('');
        setSelectedTeam('');
      } else {
        const errorText = await res.text();
        console.error('Failed to submit entry:', errorText);
        setStatus('Submission failed');
      }
    } catch (err) {
      console.error('Error submitting entry:', err);
      setStatus('Request error');
    }
  };

  const categorySelect = (label, items) => (
    <select
      value={items.find((c) => c.name === selectedCategory)?.name || ''}
      onChange={(e) => handleCategoryChange(e.target.value)}
      className="buyin-input"
    >
      <option value="">{`-- ${label} --`}</option>
      {items.map((cat) => (
        <option key={cat.name} value={cat.name}>
          {cat.name}
        </option>
      ))}
    </select>
  );

  return (
    <div className="buyins-wrapper">
      <div className="buyins-column full">
        <div className="buyins-section">
          <h2>Everything Bingo Admin Panel</h2>
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div>
              <label>Team &amp; Player:</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="buyin-input"
                >
                  <option value="">-- Select Team --</option>
                  {teamNames.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedPlayer}
                  onChange={(e) => setSelectedPlayer(e.target.value)}
                  className="buyin-input"
                >
                  <option value="">-- Select Player --</option>
                  {players.map((player) => (
                    <option key={player} value={player}>
                      {player}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label>Category:</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {categorySelect('Solo', soloCats)}
                {categorySelect('Team', teamCats)}
                {categorySelect('Purples', purpleCats)}
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

            <button type="submit" className="buyin-submit-button">
              Submit Entry
            </button>
            {status && (
              <p
                style={{
                  textAlign: 'center',
                  color: status === 'Entry submitted!' ? '#33ff66' : '#ff6666',
                }}
              >
                {status}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EverythingBingoAdmin;
