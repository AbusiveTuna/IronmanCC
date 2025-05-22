import React, { useState, useEffect } from 'react';
import './BingoBuyIns.css';

const BingoBuyInsAdmin = () => {
  const [buyins, setBuyins] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [eventName, setEventName] = useState('');
  const [amount, setAmount] = useState(10);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchBuyins = async () => {
      try {
        const res = await fetch('https://ironmancc-89ded0fcdb2b.herokuapp.com/ironmancc/buyins');
        const data = await res.json();
        setBuyins(data);

        // Set default event name once on initial fetch
        if (!eventName && data.length > 0) {
          setEventName(data[0].event_name.toLowerCase());
        }
      } catch (err) {
        console.error('Failed to fetch buy-ins:', err);
      }
    };
    fetchBuyins();
  }, []);

  useEffect(() => {
    if (status === 'Success!') {
      const timeout = setTimeout(() => setStatus(''), 3000);
      return () => clearTimeout(timeout);
    }
  }, [status]);

  const playerOptions = Array.from(new Set(buyins.map(b => b.player_name.toLowerCase())));
  const eventOptions = Array.from(new Set(buyins.map(b => b.event_name.toLowerCase())));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      player_name: playerName.toLowerCase(),
      event_name: eventName.toLowerCase(),
      amount: Number(amount)
    };

    try {
      const res = await fetch('https://ironmancc-89ded0fcdb2b.herokuapp.com/ironmancc/buyins', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setStatus('Success!');
        setPlayerName('');
        setAmount(10);
        // Leave eventName intact
      } else {
        const error = await res.json();
        console.error('Server Error:', error);
        setStatus('Error submitting buy-in');
      }
    } catch (err) {
      console.error('Error:', err);
      setStatus('Request failed');
    }
  };

  return (
    <div className="buyins-wrapper">
      <div className="buyins-column full">
        <div className="buyins-section">
          <h2>Submit Buy-In</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label>Player Name:</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <select
                  value={playerOptions.includes(playerName) ? playerName : ''}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="buyin-input"
                >
                  <option value="">-- Select Existing --</option>
                  {playerOptions.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Or type new"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="buyin-input"
                  required
                />
              </div>
            </div>
            <div>
              <label>Event Name:</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <select
                  value={eventOptions.includes(eventName) ? eventName : ''}
                  onChange={(e) => setEventName(e.target.value)}
                  className="buyin-input"
                >
                  <option value="">-- Select Existing --</option>
                  {eventOptions.map((event) => (
                    <option key={event} value={event}>{event}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Or type new"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="buyin-input"
                  required
                />
              </div>
            </div>
            <div>
              <label>Amount (m):</label><br />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="buyin-input"
                min="1"
                required
              />
            </div>

            <button type="submit" className="buyin-submit-button">Submit Buy-In</button>
            {status && (
              <p style={{ textAlign: 'center', color: status === 'Success!' ? '#33ff66' : '#ff6666' }}>
                {status}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default BingoBuyInsAdmin;
