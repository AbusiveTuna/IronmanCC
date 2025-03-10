import React from 'react';
import buyInData from './bingoBuyInData.json';
import './BingoBuyIns.css';

const BingoBuyIns = () => {
  const sortedData = [...buyInData].sort((a, b) => b.donation - a.donation);

  return (
    <div className="bingo-buyins-container">
      <h2>Buy-In Leaderboard</h2>
      <table className="buyins-table">
        <thead>
          <tr>
            <th>Player</th>
            <th>Donation</th>
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
  );
};

export default BingoBuyIns;
