import React, { useState } from 'react';
import currentData from './raidBingo2025Buyins.json';
import historicalData from 'common/json/battleship_bingo_2025_buyins.json';
import './BingoBuyIns.css';

const BingoBuyIns = () => {
  const [currentSort, setCurrentSort] = useState({ key: 'donation', direction: 'desc' });
  const [allTimeSort, setAllTimeSort] = useState({ key: 'donation', direction: 'desc' });

  const sortedCurrent = [...currentData].sort((a, b) => {
    if (currentSort.key === 'donation') {
      return currentSort.direction === 'asc' ? a.donation - b.donation : b.donation - a.donation;
    } else {
      return currentSort.direction === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
  });

  const totalCurrent = currentData.reduce((sum, player) => sum + player.donation, 0);

  const allTimeMap = {};
  [...historicalData, ...currentData].forEach(({ name, donation }) => {
    const key = name.toLowerCase();
    if (!allTimeMap[key]) {
      allTimeMap[key] = { name, donation };
    } else {
      allTimeMap[key].donation += donation;
    }
  });

  let allTimeSorted = Object.values(allTimeMap);
  allTimeSorted.sort((a, b) => {
    if (allTimeSort.key === 'donation') {
      return allTimeSort.direction === 'asc' ? a.donation - b.donation : b.donation - a.donation;
    } else {
      return allTimeSort.direction === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
  });

  const totalAllTime = allTimeSorted.reduce((sum, player) => sum + player.donation, 0);

  const formatGP = (amount) => {
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}b`;
    }
    return `${amount}m`;
  };

  return (
    <div className="buyins-wrapper">
      <div className="buyins-column wide">
        <div className="buyins-section">
          <h2>Current Event Donations</h2>
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
                  <tr key={player.name + index}>
                    <td title={`Inspect ${player.name}`}>{player.name}</td>
                    <td title={`${formatGP(player.donation)} donated`}>{formatGP(player.donation)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="buyin-totals">Total: {formatGP(totalCurrent)}</div>
        </div>
      </div>

      <div className="buyins-column narrow">
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
