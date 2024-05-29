import React, { useEffect, useState } from 'react';
import './css/PaintEvent.css';
import { templeMap } from '../common/2024PaintEvent/2024_templeMap';
import sampleData from '../common/2024PaintEvent/2024_paint.json';

const PaintEvent = () => {
  const [team1, setTeam1] = useState({ name: 'Team Floofy', tilesPainted: 0, points: 0 });
  const [team2, setTeam2] = useState({ name: 'Team Tuna', tilesPainted: 0, points: 0 });

  useEffect(() => {
    let team1Tiles = 0;
    let team2Tiles = 0;
    let team1Points = 0;
    let team2Points = 0;

    sampleData.forEach(([tile, owner]) => {
      const templeEntry = templeMap.find(entry => entry[0] === tile);
      const points = templeEntry ? templeEntry[2] : 1;

      if (owner === team1.name) {
        team1Tiles += 1;
        team1Points += points;
      } else if (owner === team2.name) {
        team2Tiles += 1;
        team2Points += points;
      }
    });

    setTeam1(prevState => ({ ...prevState, tilesPainted: team1Tiles, points: team1Points }));
    setTeam2(prevState => ({ ...prevState, tilesPainted: team2Tiles, points: team2Points }));
  }, [team1.name, team2.name]);

  const renderTiles = (points, className) => {
    return templeMap
      .filter(entry => entry[2] === points)
      .map((entry, index) => {
        const [name, displayName] = entry;
        const tileInfo = sampleData.find(tile => tile[0] === name);
        const owner = tileInfo ? tileInfo[1] : 'not_claimed';
        const kcDifference = tileInfo ? tileInfo[2] : 0;

        let bgColor = '';
        if (owner === team1.name) {
          bgColor = 'rgba(0, 255, 0, 0.3)'; // Green
        } else if (owner === team2.name) {
          bgColor = 'rgba(255, 0, 0, 0.3)'; // Red
        }

        return (
          <div key={index} className={`grid-item ${className}`} style={{ backgroundColor: bgColor }}>
            <img src={`/resources/osrs_icons/${name}.png`} alt={name} />
            <p className="kc-difference">+{kcDifference}</p>
            <p>{displayName}</p>
          </div>
        );
      });
  };

  return (
    <div>
      <header className="paintHeader">
        <div className="team1-info">
          <h2>{team1.name}</h2>
          <p>Tiles Painted: {team1.tilesPainted}</p>
          <p>Points: {team1.points}</p>
        </div>
        <div className="paint-title">
          <h1> Paint Bingo </h1>
        </div>
        <div className="team2-info">
          <h2>{team2.name}</h2>
          <p>Tiles Painted: {team2.tilesPainted}</p>
          <p>Points: {team2.points}</p>
        </div>
      </header>
      <div className="grid-container">
        <div className="grid-section">
          <h3>1 Point Tiles</h3>
          <div className="grid-content grid-content-1-point">{renderTiles(1, 'one-point')}</div>
        </div>
        <div className="grid-section">
          <h3>3 Point Tiles</h3>
          <div className="grid-content grid-content-3-point">{renderTiles(3, 'three-point')}</div>
        </div>
        <div className="grid-section">
          <h3>2 Point Tiles</h3>
          <div className="grid-content grid-content-2-point">{renderTiles(2, 'two-point')}</div>
        </div>
      </div>
    </div>
  );
};

export default PaintEvent;
