import { useState, useEffect } from 'react';
import './BingoBuyIns.css';

const CURRENT_EVENT_NAME = "Bonsai X Lukas Winter Special Bingo";

const BingoBuyIns = () => {
  const [buyins, setBuyins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSort, setCurrentSort] = useState({ key: 'donation', direction: 'desc' });
  const [allTimeSort, setAllTimeSort] = useState({ key: 'donation', direction: 'desc' });

  useEffect(() => {
    const fetchBuyIns = async () => {
      try {
        const response = await fetch('https://api.ironmancc.com/ironmancc/buyins');
        const data = await response.json();
        setBuyins(data);
      } catch (err) {
        console.error('Error fetching buyins:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBuyIns();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const currentData = buyins.filter(b => b.event_name === CURRENT_EVENT_NAME);
  const uniqueCurrentPlayers = new Set(currentData.map(b => b.player_name.toLowerCase())).size;
  const totalCurrent = currentData.reduce((sum, b) => sum + b.amount, 0);

  const allTimeMap = {};
  buyins.forEach(({ player_name, amount }) => {
    const key = player_name.toLowerCase();
    if (!allTimeMap[key]) {
      allTimeMap[key] = { name: player_name, donation: amount };
    } else {
      allTimeMap[key].donation += amount;
    }
  });

  let allTimeSorted = Object.values(allTimeMap).sort((a, b) => {
    if (allTimeSort.key === 'donation') {
      return allTimeSort.direction === 'asc' ? a.donation - b.donation : b.donation - a.donation;
    } else {
      return allTimeSort.direction === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
  });
  const totalAllTime = allTimeSorted.reduce((sum, b) => sum + b.donation, 0);

  const sortedCurrent = [...currentData].sort((a, b) => {
    if (currentSort.key === 'donation') {
      return currentSort.direction === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    } else {
      return currentSort.direction === 'asc'
        ? a.player_name.localeCompare(b.player_name)
        : b.player_name.localeCompare(a.player_name);
    }
  });

  const formatGP = (amount) => {
    return amount >= 1000 ? `${(amount / 1000).toFixed(1)}b` : `${amount}m`;
  };

  return (
    <div className="buyins-wrapper">
      <div className="buyins-column wide">
        <div className="buyins-section">
          <h2>Bonsai X Lukas Winter Special Bingo</h2>
          <div className="buyin-table-container">
            <table className="buyin-table">
              <thead>
                <tr>
                  <th
                    onClick={() =>
                      setCurrentSort({
                        key: 'name',
                        direction: currentSort.key === 'name' && currentSort.direction === 'asc' ? 'desc' : 'asc'
                      })
                    }
                  >
                    Player {currentSort.key === 'name' ? (currentSort.direction === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th
                    onClick={() =>
                      setCurrentSort({
                        key: 'donation',
                        direction: currentSort.key === 'donation' && currentSort.direction === 'asc' ? 'desc' : 'asc'
                      })
                    }
                  >
                    Donation {currentSort.key === 'donation' ? (currentSort.direction === 'asc' ? '↑' : '↓') : ''}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedCurrent.map((player, index) => (
                  <tr key={player.player_name + index}>
                    <td title={`Inspect ${player.player_name}`}>{player.player_name}</td>
                    <td title={`${formatGP(player.amount)} donated`}>{formatGP(player.amount)}</td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
          <div className="buyin-totals">
            <span className="buyin-total-amount">Total GP: {formatGP(totalCurrent)}</span>
            <span className="buyin-total-unique">Unique Players: {uniqueCurrentPlayers}</span>
          </div>
        </div>
      </div>

      <div className="buyins-column full">
        <div className="buyins-section">
          <h2>All-Time Donations</h2>
          <div className="buyin-table-container">
            <table className="buyin-table">
              <thead>
                <tr>
                  <th
                    onClick={() =>
                      setAllTimeSort({
                        key: 'name',
                        direction: allTimeSort.key === 'name' && allTimeSort.direction === 'asc' ? 'desc' : 'asc'
                      })
                    }
                  >
                    Player {allTimeSort.key === 'name' ? (allTimeSort.direction === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th
                    onClick={() =>
                      setAllTimeSort({
                        key: 'donation',
                        direction: allTimeSort.key === 'donation' && allTimeSort.direction === 'asc' ? 'desc' : 'asc'
                      })
                    }
                  >
                    Total {allTimeSort.key === 'donation' ? (allTimeSort.direction === 'asc' ? '↑' : '↓') : ''}
                  </th>
                </tr>
              </thead>
              <tbody>
                {allTimeSorted.map((player, index) => (
                  <tr key={player.name + index}>
                    <td title={`Inspect ${player.name}`}>{player.name}</td>
                    <td title={`${formatGP(player.donation)} total`}>{formatGP(player.donation)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="buyin-totals">Total: {formatGP(totalAllTime)}</div>
        </div>
      </div>
    </div>
  );

};

export default BingoBuyIns;
