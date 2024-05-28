import React, { useEffect, useState } from 'react';
import './css/PaintEvent.css';
import { templeMap } from '../common/constants';
import sampleData from '../common/example_paint.json';

const PaintEvent = () => {
  const [team1, setTeam1] = useState({ name: 'Team Floofy', tilesPainted: 0 });
  const [team2, setTeam2] = useState({ name: 'Team Tuna', tilesPainted: 0 });

  useEffect(() => {
    let team1Tiles = 0;
    let team2Tiles = 0;

    sampleData.forEach(([tile, owner]) => {
      if (owner === team1.name) {
        team1Tiles += 1;
      } else if (owner === team2.name) {
        team2Tiles += 1;
      }
    });

    setTeam1(prevState => ({ ...prevState, tilesPainted: team1Tiles }));
    setTeam2(prevState => ({ ...prevState, tilesPainted: team2Tiles }));
  }, [team1.name, team2.name]);

  return (
    <div>
      <header className="paintHeader">
        <div className="team-info">
          <h2>{team1.name}</h2>
          <p>Tiles Painted: {team1.tilesPainted}</p>
        </div>
        <div className="team-info">
          <h2>{team2.name}</h2>
          <p>Tiles Painted: {team2.tilesPainted}</p>
        </div>
      </header>
      <div className="grid-container">
        {templeMap.map((entry, index) => {
          const [name, second, third] = entry;
          let displayName;

          if (typeof second === 'string') {
            displayName = second;
          } else {
            displayName = third || name;
          }

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
            <div key={index} className="grid-item" style={{ backgroundColor: bgColor }}>
              <img src={`/resources/osrs_icons/${name}.png`} alt={name} />
              <p className="kc-difference">+{kcDifference}</p>
              <p>{displayName}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaintEvent;
