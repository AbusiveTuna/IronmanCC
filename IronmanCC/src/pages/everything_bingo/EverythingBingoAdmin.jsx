import React, { useState, useEffect } from 'react';
import categories from './Categories.json';

const CURRENT_EVENT_NAME = 'everything bingo v2';

const EverythingBingoAdmin = () => {
    const [selectedTeam, setSelectedTeam] = useState('');
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const res = await fetch(`https://ironmancc-89ded0fcdb2b.herokuapp.com/ironmancc/buyins/players/${CURRENT_EVENT_NAME}`);
                const data = await res.json();
                setPlayers(data.sort());
            } catch (err) {
                console.error('Failed to fetch player names:', err);
            }
        };

        fetchPlayers();
    }, []);

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
        entry: inputValue.trim()
    };

    try {
        const res = await fetch('https://ironmancc-89ded0fcdb2b.herokuapp.com/everythingBingo/entries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

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


    return (
        <div className="buyins-wrapper">
            <div className="buyins-column full">
                <div className="buyins-section">
                    <h2>Everything Bingo Admin Panel</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label>Player:</label>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <select
                                    value={selectedPlayer}
                                    onChange={(e) => setSelectedPlayer(e.target.value)}
                                    className="buyin-input"
                                >
                                    <option value="">-- Select Player --</option>
                                    {players.map(player => (
                                        <option key={player} value={player}>{player}</option>
                                    ))}
                                </select>

                                <select
                                    value={selectedTeam}
                                    onChange={(e) => setSelectedTeam(e.target.value)}
                                    className="buyin-input"
                                >
                                    <option value="">-- Select Team --</option>
                                    <option value="Tuna">Tuna</option>
                                    <option value="Bass">Bass</option>
                                    <option value="Salmon">Salmon</option>
                                    <option value="Chase">Chase</option>
                                </select>
                            </div>
                        </div>


                        <div>
                            <label>Category:</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="buyin-input"
                            >
                                <option value="">-- Select Category --</option>
                                {categories.map(cat => (
                                    <option key={cat.name} value={cat.name}>
                                        {cat.name} ({cat.Type})
                                    </option>
                                ))}
                            </select>
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
                        {status && (
                            <p style={{ textAlign: 'center', color: status === 'Ready to send (stub)' ? '#33ff66' : '#ff6666' }}>
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
