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

  // Build arrays of names in lowercase for case-insensitive checks
  const teamOneNames = teamOne.map(player => player.name.toLowerCase());
  const teamTwoNames = teamTwo.map(player => player.name.toLowerCase());

  const filteredPlayers = players
    // Filter out players who appear in either team (case-insensitive)
    .filter(
      player =>
        !teamOneNames.includes(player.name.toLowerCase()) &&
        !teamTwoNames.includes(player.name.toLowerCase())
    )
    // Sort in a case-insensitive manner
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

  return (
    <div className="draft-container">
      <h1>Draft</h1>

      <div className="tables-container">
        <div className="table-container">
          <h2>Available Players</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map((player, index) => (
                <tr key={index}>
                  <td>{player.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-container">
          <h2>Team Tuna</h2>
          <table>
            <thead>
              <tr>
                <th>The Fish</th>
              </tr>
            </thead>
            <tbody>
              {teamOne.map((player, index) => (
                <tr key={index}>
                  <td>{player.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-container">
          <h2>Goose's Giggle Monsters</h2>
          <table>
            <thead>
              <tr>
                <th>The Whists</th>
              </tr>
            </thead>
            <tbody>
              {teamTwo.map((player, index) => (
                <tr key={index}>
                  <td>{player.name}</td>
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
