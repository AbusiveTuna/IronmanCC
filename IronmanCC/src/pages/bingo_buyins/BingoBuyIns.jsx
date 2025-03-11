import React, { useState } from 'react';
import buyInData from './bingoBuyInData.json';
import './BingoBuyIns.css';

const BingoBuyIns = () => {
  const [sortConfig, setSortConfig] = useState({ key: 'donation', direction: 'desc' });

  const sortedData = [...buyInData].sort((a, b) => {
    if (sortConfig.key === 'donation') {
      return sortConfig.direction === 'asc' ? a.donation - b.donation : b.donation - a.donation;
    } else {
      return sortConfig.direction === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    }
  });

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const totalDonation = buyInData.reduce((sum, player) => sum + player.donation, 0);

  return (
    <div className="bingo-layout">
      <div className="bingo-buyins-container">
        <h2>Buy-In Leaderboard</h2>
        <table className="buyins-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Player</th>
              <th onClick={() => handleSort('donation')} style={{ cursor: 'pointer' }}>Donation</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((player, index) => (
              <tr key={player.name + index}>
                <td>{player.name}</td>
                <td>{player.donation}m</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="total-donations-container">
        <h2>Total Donations</h2>
        <table className="buyins-table">
          <tbody>
            <tr>
              <td>Total:</td>
              <td>{totalDonation}m</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BingoBuyIns;
