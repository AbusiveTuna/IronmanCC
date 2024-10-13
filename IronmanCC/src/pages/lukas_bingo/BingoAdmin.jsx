import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './LukasBingo.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const LukasBingoAdmin = () => {
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
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    axios.get('https://ironmancc-89ded0fcdb2b.herokuapp.com/lukas-data')
      .then(response => {
        const { teamA, teamB } = response.data;
        setCountsTeamA(teamA.map(item => item.count));
        setCountsTeamB(teamB.map(item => item.count));
        setSabotageTeamA(teamA.map(item => item.sabotage || false));
        setSabotageTeamB(teamB.map(item => item.sabotage || false));
      })
      .catch(error => {
        console.error("Error fetching data", error);
      });
  }, []);

  const extractAmount = (description) => {
    const match = description.match(/\d+/);
    return match ? parseInt(match[0], 10) : 1;
  };

  const getIconUrl = (imageName) => {
    return `/resources/bingo/${encodeURIComponent(imageName)}.png`;
  };

  const incrementCount = (team, index) => {
    if (team === 'A') {
      setCountsTeamA((prevCounts) => {
        const newCounts = [...prevCounts];
        const amount = extractAmount(imageDesc[index]);
        if (newCounts[index] < amount) newCounts[index] += 1;
        return newCounts;
      });
    } else {
      setCountsTeamB((prevCounts) => {
        const newCounts = [...prevCounts];
        const amount = extractAmount(imageDesc[index]);
        if (newCounts[index] < amount) newCounts[index] += 1;
        return newCounts;
      });
    }
  };

  const decrementCount = (team, index) => {
    if (team === 'A') {
      setCountsTeamA((prevCounts) => {
        const newCounts = [...prevCounts];
        if (newCounts[index] > 0) newCounts[index] -= 1;
        return newCounts;
      });
    } else {
      setCountsTeamB((prevCounts) => {
        const newCounts = [...prevCounts];
        if (newCounts[index] > 0) newCounts[index] -= 1;
        return newCounts;
      });
    }
  };

  const toggleSabotage = (team, index) => {
    if (team === 'A') {
      setSabotageTeamA(prevState => {
        const newState = [...prevState];
        newState[index] = !newState[index];
        return newState;
      });
    } else {
      setSabotageTeamB(prevState => {
        const newState = [...prevState];
        newState[index] = !newState[index];
        return newState;
      });
    }
  };

  const handleSave = () => {
    const payload = {
      teamA: imageNames.map((name, index) => ({
        name,
        count: countsTeamA[index] || 0,
        sabotage: sabotageTeamA[index] || false,
      })),
      teamB: imageNames.map((name, index) => ({
        name,
        count: countsTeamB[index] || 0,
        sabotage: sabotageTeamB[index] || false,
      })),
    };

    axios.post('https://ironmancc-89ded0fcdb2b.herokuapp.com/save-lukas-data', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log('Data saved successfully:', response.data);
      })
      .catch(error => {
        console.error('Error saving data', error);
      });

    setIsEditing(false);
  };

  const renderGrid = (teamName, counts, teamKey) => {
    const sabotage = teamKey === 'A' ? sabotageTeamA : sabotageTeamB;

    const displayName = teamKey === 'A' ? 'Mong and the Salties' : 'The Faladorable Guards';

    return (
      <div className="bingo-grid admin-grid">
        <h3>{displayName}</h3>
        <Container>
          {[...Array(7)].map((_, rowIndex) => (
            <Row key={rowIndex}>
              {[...Array(7)].map((_, colIndex) => {
                const tileIndex = rowIndex * 7 + colIndex;
                if (tileIndex >= imageNames.length) return null;
                const description = imageDesc[tileIndex];
                const amount = extractAmount(description);
                const currentCount = counts[tileIndex];
                const isSabotaged = sabotage[tileIndex];
                const tileCompleted = currentCount >= amount;

                return (
                  <Col
                    key={colIndex}
                    className={`bingo-tile admin-tile ${tileCompleted ? 'completed' : ''}`}
                  >
                    <div className="tile-description">{description}</div>
                    <img src={getIconUrl(imageNames[tileIndex])} alt={imageNames[tileIndex]} className="tile-image" />
                    {isSabotaged && (
                      <img
                        src={getIconUrl('sabotage')}
                        alt="Sabotage"
                        className="sabotage-icon"
                      />
                    )}
                    <div className="tile-counter-actions">
                      <div className="tile-counter">{currentCount}/{amount}</div>
                      {isEditing && (
                        <div className="tile-actions">
                          <button onClick={() => decrementCount(teamKey, tileIndex)}>-</button>
                          <button onClick={() => incrementCount(teamKey, tileIndex)}>+</button>
                          <button onClick={() => toggleSabotage(teamKey, tileIndex)}>
                            {isSabotaged ? 'Remove' : 'Sabotage'}
                          </button>
                        </div>
                      )}
                    </div>
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
        <Col>{renderGrid('Team A', countsTeamA, 'A')}</Col>
        <Col>{renderGrid('Team B', countsTeamB, 'B')}</Col>
      </Row>
      <div className="admin-controls">
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        ) : (
          <Button onClick={handleSave}>Save</Button>
        )}
      </div>
    </div>
  );
};

export default LukasBingoAdmin;
