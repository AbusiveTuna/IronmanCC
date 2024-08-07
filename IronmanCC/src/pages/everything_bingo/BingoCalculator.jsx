import React, { useState, useEffect } from 'react';
import fetchTempleData from '../../hooks/fetchTempleData';
import usePointDisplacement from './usePointDisplacement';
import { Table, Container, Row, Col, Form } from 'react-bootstrap';
import './BingoCalculator.css';

const BingoCalculator = () => {
  const [playerName, setPlayerName] = useState('');
  const [teamName, setTeamName] = useState('');
  const data = fetchTempleData();
  const optimalPlacement = usePointDisplacement(playerName, teamName, data);

  const [playerNames, setPlayerNames] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [pointsThreshold, setPointsThreshold] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'category', direction: 'ascending' });

  useEffect(() => {
    if (data) {
      const namesSet = new Set();
      for (const category in data.results) {
        data.results[category].forEach(player => {
          namesSet.add(player.playerName);
        });
      }
      setPlayerNames(Array.from(namesSet).sort());
    }
  }, [data]);

  useEffect(() => {
    if (playerName && optimalPlacement) {
      setDisplayData(optimalPlacement);
    } else {
      setDisplayData([]);
    }
  }, [optimalPlacement, playerName]);

  const handlePlayerChange = (event) => {
    const selectedPlayer = event.target.value;
    setPlayerName(selectedPlayer);

    if (selectedPlayer === '') {
      setTeamName('');
      return;
    }

    for (const category in data.results) {
      const player = data.results[category].find(p => p.playerName === selectedPlayer);
      if (player) {
        setTeamName(player.teamName);
        break;
      }
    }
  };

  const handlePointsChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setPointsThreshold(value);
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedDisplayData = () => {
    let sortableItems = [];
    Object.keys(displayData).forEach((category) => {
      groupByPoints(displayData[category]).forEach((entry) => {
        sortableItems.push({ category, ...entry });
      });
    });

    sortableItems.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    return sortableItems;
  };

  const groupByPoints = (categoryData) => {
    const groupedData = {};

    categoryData.forEach(entry => {
      if (entry.pointsGained >= pointsThreshold) {
        if (!groupedData[entry.pointsGained]) {
          groupedData[entry.pointsGained] = {
            places: [],
            pointsGained: entry.pointsGained,
            xpGainNeeded: entry.xpGainNeeded
          };
        }
        groupedData[entry.pointsGained].places.push(entry.newPlace);
      }
    });

    const sortedData = Object.values(groupedData).sort((a, b) => b.pointsGained - a.pointsGained);

    return sortedData;
  };

  return (
    <Container>
      <h1>Bingo Calculator</h1>
      <div className="inputs-header">Points Gained - Means points gained for your team, not individual player.</div>
      <div className="inputs-header">If a row has more than one place (1,2,3) it means that getting 1st, 2nd, or 3rd place all give the same points.</div>
      <Row className="input-row">
        <Col>
          <label htmlFor="playerSelect">Select Player:</label>
          <Form.Select id="playerSelect" onChange={handlePlayerChange} value={playerName}>
            <option value="">Select a player</option>
            {playerNames.map((name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col>
          <label htmlFor="pointsThreshold">Points Threshold:</label>
          <Form.Control
            type="number"
            id="pointsThreshold"
            value={pointsThreshold}
            onChange={handlePointsChange}
            min="10"
            max="25"
          />
        </Col>
      </Row>
      <h2>Optimal Placement</h2>
      {sortedDisplayData().length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th onClick={() => requestSort('category')}>Category</th>
              <th onClick={() => requestSort('places')}>Place(s)</th>
              <th onClick={() => requestSort('pointsGained')}>Points Gained</th>
              <th onClick={() => requestSort('xpGainNeeded')}>XP Gain Needed</th>
            </tr>
          </thead>
          <tbody>
            {sortedDisplayData().map((entry, i) => (
              <tr key={i}>
                <td>{entry.category}</td>
                <td>{entry.places.join(', ')}</td>
                <td>{entry.pointsGained}</td>
                <td>{entry.xpGainNeeded || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No data to display.</p>
      )}
    </Container>
  );
};

export default BingoCalculator;
