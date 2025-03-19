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

    const teamOneNames = teamOne.map(player => player.name);
    const teamTwoNames = teamTwo.map(player => player.name);

    const filteredPlayers = players
        .filter(player => !teamOneNames.includes(player.name) && !teamTwoNames.includes(player.name))
        .sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="draft-container">
            <h1>Draft</h1>

            <div className="tables-container">
                <div className="table-container">
                    <h2>Available Players</h2>
                    <table>
                        <thead>
                            <tr><th>Name</th></tr>
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
                            <tr><th>The Fish</th></tr>
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
                    <h2>Team Bid</h2>
                    <table>
                        <thead>
                            <tr><th>The Whists</th></tr>
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
