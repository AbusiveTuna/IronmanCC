import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './LukasBingo.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const LukasBingo = () => {
  const imageNames = [
    'arcane', 'craws', 'virtus', 'zulrah', 'ralos', 'ahrimskirt', 'scythe',
    'moons', 'fang', 'jar', 'venshard', 'hilt', 'dragonbone', 'prims',
    'nihilhorn', 'rangerboots', 'easyclue', 'torva', 'bryo', 'voidwaker', 'ballista',
    'bloodshard', 'eternalgem', 'tome', 'bosspet', 'guildhunter', 'shadow', 'cmdust',
    'inqhelm', 'dragonwand', 'eldermaul', 'cudgel', 'sra', 'masori', 'bandosboots',
    'holyelix', '3rdage', 'magebook', 'mystic', 'armacrossbow', 'endurance', 'mining',
    'blackcore', 'beaver', 'enh', 'hydra', 'lotr', 'hmtkit', 'synapse'
  ];

  const imageDesc = ["4 Arcanes", 'craws bow', '3 virtus pieces', '5 zulrah uniques', 'Ralos', 'Ahrim Robeskirt', 'Scythe',
    'Full Moon Gear', 'Arraxyte Fang', '2 jars', '5 venator Shards', 'Zamorak Hilt', 'Dragonbone Necklance', 'Primordial Crystal',
    'Nihil Horn', 'Ranger Boots', 'Ham Joint + Flared Trousers', 'Torva Helm', 'Bryo Staff', 'Voidwaker', 'Ballista from Scratch',
    '5 Blood Shards', 'Eternal Gem', 'Tome of Fire', '3 Boss Pets', '4 Guild Hunter Outfit Pieces', 'Shadow', 'CM Dust',
    'Inq Helm', 'DH Wand & Tome of Earth', 'Eldermaul', '5 Cudgel', 'Soul Reaper Axe', 'Masori from Scratch', '2 bandos boots',
    'Holy Elixir', 'Any 3rd Age or Gilded', 'Mages book & wand', 'Any Dusk Mystic', 'Armadyl Crossbow', 'Ring of Endurance', '5M Mining XP',
    'Black Tourmaline Core', 'Any Skilling Pet', 'Enhanced Weapon Seed', 'Hydra Claw', 'LOTR', 'Any HMT kit', '3 tormented synapses'
  ];

  const [countsTeamA, setCountsTeamA] = useState(imageDesc.map(() => 0));
  const [countsTeamB, setCountsTeamB] = useState(imageDesc.map(() => 0));
  const [sabotageTeamA, setSabotageTeamA] = useState(imageDesc.map(() => false));
  const [sabotageTeamB, setSabotageTeamB] = useState(imageDesc.map(() => false));

  useEffect(() => {
    axios
      .get('https://ironmancc-89ded0fcdb2b.herokuapp.com/lukas-data')
      .then((response) => {
        const { teamA, teamB } = response.data;
        setCountsTeamA(teamA.map((item) => item.count));
        setCountsTeamB(teamB.map((item) => item.count));
        setSabotageTeamA(teamA.map((item) => item.sabotage || false));
        setSabotageTeamB(teamB.map((item) => item.sabotage || false));
      })
      .catch((error) => {
        console.error('Error fetching data', error);
      });
  }, []);

  const getIconUrl = (imageName) => {
    return `/resources/bingo/${encodeURIComponent(imageName)}.png`;
  };

  const extractAmount = (description) => {
    const match = description.match(/\d+/); 
    return match ? parseInt(match[0], 10) : 1; 
  };

  const renderGrid = (teamKey, counts, sabotage) => {

    const displayName = teamKey === 'A' ? 'Mong and the Salties' : 'The Faladorable Guards';

    return (
      <div className="bingo-grid">
        <h3>{displayName}</h3>
        <Container>
          {[...Array(7)].map((_, rowIndex) => (
            <Row key={rowIndex}>
              {[...Array(7)].map((_, colIndex) => {
                const tileIndex = rowIndex * 7 + colIndex;
                if (tileIndex >= imageNames.length) return null;
                const imageName = imageNames[tileIndex];
                const description = imageDesc[tileIndex];
                const amount = extractAmount(description);
                const currentCount = counts[tileIndex];
                const isSabotaged = sabotage[tileIndex];

                const tileCompleted = currentCount >= amount;

                return (
                  <Col
                    key={colIndex}
                    className={`bingo-tile ${tileCompleted ? 'completed' : ''}`}
                    style={{
                      backgroundColor: tileCompleted ? 'green' : 'transparent',
                      position: 'relative',
                    }}
                  >
                    <div className="tile-description">{description}</div>
                    <img src={getIconUrl(imageName)} alt={imageName} className="tile-image" />
                    <div className="tile-counter">
                      {currentCount}/{amount}
                    </div>

                    {isSabotaged && (
                      <img
                        src={getIconUrl('sabotage')}
                        alt="Sabotage"
                        className="sabotage-icon"
                      />
                    )}
                  </Col>
                );
              })}
            </Row>
          ))}
        </Container>
      </div>
    );
  };

  return (
    <div className="lukas-bingo">
      <Row>
        <Col>{renderGrid('A', countsTeamA, sabotageTeamA)}</Col>
        <Col>{renderGrid('B', countsTeamB, sabotageTeamB)}</Col>
      </Row>
    </div>
  );
};

export default LukasBingo;
