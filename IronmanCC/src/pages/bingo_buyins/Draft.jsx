import React, { useState, useEffect } from 'react';
import playersData from './bingoBuyInData.json';
import tunaData from './teamTuna.json';
import bidData from './teamBid.json';
import './draft.css';

const Draft = () => {
  const [players, setPlayers] = useState([]);
  const [teamOne, setTeamOne] = useState([]);
  const [teamTwo, setTeamTwo] = useState([]);

  useEffect(() => {
    setPlayers(playersData);
    setTeamOne(tunaData);
    setTeamTwo(bidData);
  }, []);

  const teamOneNames = teamOne.map(player => player.name.toLowerCase());
  const teamTwoNames = teamTwo.map(player => player.name.toLowerCase());

  const filteredPlayers = players
    .filter(
      player =>
        !teamOneNames.includes(player.name.toLowerCase()) &&
        !teamTwoNames.includes(player.name.toLowerCase())
    )
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

  return (
    <div className="draft-container">
      <h1 className='d-h1'>Draft</h1>

      <div className="d-tables-container">
        <div className="d-table-container">
          <h2 className="d-h2">Available Players</h2>
          <table className="d-table">
            <thead className="d-thead">
              <tr className="d-tr">
                <th className="d-th">Name</th>
              </tr>
            </thead>
            <tbody className="d-tbody">
              {filteredPlayers.map((player, index) => (
                <tr key={index} className="d-tr">
                  <td className="d-td">{player.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-table-container">
          <h2 className="d-h2">Team Tuna</h2>
          <table className="d-table">
            <thead className="d-thead">
              <tr className="d-tr">
                <th className="d-th">The Fish</th>
              </tr>
            </thead>
            <tbody className="d-tbody">
              {teamOne.map((player, index) => (
                <tr key={index} className="d-tr">
                  <td className="d-td">{player.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-table-container">
          <h2 className="d-h2">Goose's Giggle Monsters</h2>
          <table className="d-table">
            <thead className="d-thead">
              <tr className="d-tr">
                <th className="d-th">The Whists</th>
              </tr>
            </thead>
            <tbody className="d-tbody">
              {teamTwo.map((player, index) => (
                <tr key={index} className="d-tr">
                  <td className="d-td">{player.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Draft;
