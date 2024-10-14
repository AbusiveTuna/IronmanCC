import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './LukasBingo.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

import lukasTiles from './TileInfo.json';

const LukasBingoAdmin = () => {
  const [countsTeamA, setCountsTeamA] = useState(null);
  const [countsTeamB, setCountsTeamB] = useState(null);
  const [sabotageTeamA, setSabotageTeamA] = useState(null);
  const [sabotageTeamB, setSabotageTeamB] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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

  const incrementCount = (team, index) => {
    if (team === 'A') {
      setCountsTeamA((prevCounts) => {
        const newCounts = [...prevCounts];
        const amount = lukasTiles.tiles[index].totalAmount;
        if (newCounts[index] < amount) newCounts[index] += 1;
        return newCounts;
      });
    } else {
      setCountsTeamB((prevCounts) => {
        const newCounts = [...prevCounts];
        const amount = lukasTiles.tiles[index].totalAmount;
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
      setSabotageTeamA((prevState) => {
        const newState = [...prevState];
        newState[index] = !newState[index];
        return newState;
      });
    } else {
      setSabotageTeamB((prevState) => {
        const newState = [...prevState];
        newState[index] = !newState[index];
        return newState;
      });
    }
  };

  const handleSave = () => {
    const payload = {
      teamA: lukasTiles.tiles.map((tile, index) => ({
        name: tile.name,
        count: countsTeamA[index] || 0,
        sabotage: sabotageTeamA[index] || false,
      })),
      teamB: lukasTiles.tiles.map((tile, index) => ({
        name: tile.name,
        count: countsTeamB[index] || 0,
        sabotage: sabotageTeamB[index] || false,
      })),
    };

    axios
      .post('https://ironmancc-89ded0fcdb2b.herokuapp.com/save-lukas-data', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        console.log('Data saved successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error saving data', error);
      });

    setIsEditing(false);
  };

  const renderGrid = (teamKey, counts, sabotage) => {
    const displayName = teamKey === 'A' ? 'Mong and the Salties' : 'The Faladorable Guards';

    return (
      <div className="bingo-grid admin-grid">
        <h3>{displayName}</h3>
        <Container>
          {[...Array(7)].map((_, rowIndex) => (
            <Row key={rowIndex}>
              {[...Array(7)].map((_, colIndex) => {
                const tileIndex = rowIndex * 7 + colIndex;
                if (tileIndex >= lukasTiles.tiles.length) return null;
                const currentTile = lukasTiles.tiles[tileIndex];
                const imageName = currentTile.name;
                const description = currentTile.description;
                const amount = currentTile.totalAmount;
                if (counts == null) {
                  return null; // Data hasn't loaded yet
                }
                const currentCount = counts[tileIndex];
                const isSabotaged = sabotage[tileIndex];

                // Determine tile progress
                let tileProgress = '';
                if (currentCount > 0) {
                  tileProgress = '-inprogress';
                }
                if (currentCount >= amount) {
                  tileProgress = '-complete';
                }
                const tileClass = 'tile' + tileProgress;

                return (
                  <Col
                    key={colIndex}
                    className={`bingo-tile admin-tile ${tileClass}`}
                  >
                    <div className="tile-description">{description}</div>
                    <img src={getIconUrl(imageName)} alt={imageName} className="tile-image" />
                    {isSabotaged && (
                      <img
                        src={getIconUrl('sabotage')}
                        alt="Sabotage"
                        className="sabotage-icon"
                      />
                    )}
                    <div className="tile-counter-actions">
                      <div className="tile-counter">
                        {currentCount}/{amount}
                      </div>
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
        <Col>{renderGrid('A', countsTeamA, sabotageTeamA)}</Col>
        <Col>{renderGrid('B', countsTeamB, sabotageTeamB)}</Col>
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
