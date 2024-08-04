import React, { useEffect, useState } from 'react';
import { Button, Table, Container, Row, Col } from 'react-bootstrap';
import { templeMap } from '../common/templeMap';
import axios from 'axios';
import './css/GooseBingo.css';

import 'bootstrap/dist/css/bootstrap.min.css';

const GooseBingo = () => {
  const [data, setData] = useState(null);
  const [sheetData, setSheetData] = useState([]);
  const [skillData, setSkillData] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState('Team Totals');
  const [topPlayers, setTopPlayers] = useState([]);
  const [combinedTopPlayers, setCombinedTopPlayers] = useState([]);
  const [teamTotals, setTeamTotals] = useState([]);
  const [selectedHeader, setSelectedHeader] = useState(null);
  const [showSheetButtons, setShowSheetButtons] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://ironmancc-89ded0fcdb2b.herokuapp.com/results');
        const responseData = response.data;
        setData(responseData);
  
        const sheetResponse = await axios.get('https://ironmancc-89ded0fcdb2b.herokuapp.com/fetchSheetData');
        const sheetResponseData = sheetResponse.data.map(category => ({
          ...category,
          players: category.players
            .filter(player => typeof player.team === 'string' && !player.team.includes('"type":"N_A"'))
            .map(player => ({
              ...player,
              team: player.team.replace(/'/g, '')
            }))
        }));
        setSheetData(sheetResponseData);
  
        calculateTopPlayers(responseData.results);
        calculateCombinedTopPlayers(responseData.results, sheetResponseData);
  
        // Combine team totals from both data sources
        const combinedTeamTotals = calculateCombinedTeamTotals(responseData, sheetResponseData);
        setTeamTotals(combinedTeamTotals);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  
  const calculateTopPlayers = (results) => {
    const players = [];
    for (const skill in results) {
      results[skill].forEach(player => {
        const existingPlayer = players.find(p => p.playerName === player.playerName);
        if (existingPlayer) {
          existingPlayer.points += player.points;
        } else {
          players.push({ ...player });
        }
      });
    }
    const sortedPlayers = players.sort((a, b) => b.points - a.points).slice(0, 10);
    setTopPlayers(sortedPlayers);
  };

  const calculateCombinedTopPlayers = (results, sheetData) => {
    const players = [];
    const addPlayer = (player, points) => {
      const existingPlayer = players.find(p => p.playerName.toLowerCase() === player.toLowerCase());
      if (existingPlayer) {
        existingPlayer.points += points;
      } else {
        players.push({ playerName: player, points });
      }
    };

    for (const skill in results) {
      results[skill].forEach(player => {
        addPlayer(player.playerName, player.points);
      });
    }

    sheetData.forEach(category => {
      category.players.forEach(player => {
        addPlayer(player.name, player.points);
      });
    });

    const sortedPlayers = players.sort((a, b) => b.points - a.points).slice(0, 10);
    setCombinedTopPlayers(sortedPlayers);
  };

  const calculateCombinedTeamTotals = (responseData, sheetResponseData) => {
    const teamPoints = {};

    for (const teamName in responseData.team_totals) {
      const cleanTeamName = teamName.replace(/'/g, '');
      if (!teamPoints[cleanTeamName]) {
        teamPoints[cleanTeamName] = 0;
      }
      teamPoints[cleanTeamName] += responseData.team_totals[teamName];
    }

    sheetResponseData.forEach(category => {
      category.players.forEach(player => {
        if (!teamPoints[player.team]) {
          teamPoints[player.team] = 0;
        }
        teamPoints[player.team] += player.points;
      });
    });

    const teamTotalsArray = Object.keys(teamPoints).map(teamName => ({
      teamName,
      points: teamPoints[teamName]
    }));

    teamTotalsArray.sort((a, b) => b.points - a.points);

    return teamTotalsArray;
  };

  const handleClick = (skill) => {
    if (skill === 'Team Totals') {
      setSkillData(null);
      setSelectedSkill(skill);
      setSelectedHeader(null);
    } else if (data && data.results) {
      const skillData = data.results[skill];
      setSkillData(skillData);
      setSelectedSkill(skill);
      setSelectedHeader(null);
    } else {
      console.log('Data not available');
    }
  };

  const handleHeaderClick = (header) => {
    setSelectedHeader(header);
    setSelectedSkill(null);
    setSkillData(null);
  };

  const toggleSheetButtons = () => {
    setShowSheetButtons(!showSheetButtons);
  };

  const formatSkillName = (skill) => {
    return skill.replace(/_/g, ' ');
  };

  const getIconUrl = (skill) => {
    if (skill === "Phosani's Nightmare") {
      skill = "Phosanis Nightmare";
    }
    return `/resources/osrs_icons/${encodeURIComponent(skill)}.png`;
  };

  return (
    <Container className="bingo-container" fluid>
      <Row className="mb-2 justify-content-center mt-4">
        <Col xs="auto" className="mb-1 p-1 text-center">
          <Button
            variant="outline-primary"
            onClick={() => handleClick('Team Totals')}
            className="skill-button"
          >
            <span className="visually-hidden">Team Totals</span>
            <div
              className="button-background"
              style={{ backgroundImage: `url(${getIconUrl('Total')})` }}
            />
          </Button>
        </Col>
        {templeMap.map(([name], index) => (
          <Col key={index} xs="auto" className="mb-1 p-1 text-center">
            <Button
              variant="outline-primary"
              onClick={() => handleClick(name)}
              className="skill-button"
            >
              <span className="visually-hidden">{name}</span>
              <div
                className="button-background"
                style={{ backgroundImage: `url(${getIconUrl(name)})` }}
              />
            </Button>
          </Col>
        ))}
        <Col xs="auto" className="mb-1 p-1 text-center">
          <Button
            variant="outline-secondary"
            onClick={toggleSheetButtons}
            className="skill-button"
          >
            <span className="button-text">{showSheetButtons ? 'Hide ST' : 'Speed Times'}</span>
          </Button>
        </Col>
        {showSheetButtons && sheetData && sheetData.map((category, index) => (
          <Col key={index} xs="auto" className="mb-1 p-1 text-center">
            <Button
              variant="outline-secondary"
              onClick={() => handleHeaderClick(category.header)}
              className="sheet-data-button"
            >
              <span className="visually-hidden">{category.header}</span>
              <div className="button-text">{category.header}</div>
            </Button>
          </Col>
        ))}
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} md={7} className="text-center">
          {selectedSkill === 'Team Totals' ? (
            <div>
              <div className="selected-skill-header">
                <img
                  src={getIconUrl('Total')}
                  alt="Team Totals"
                  className="selected-skill-icon"
                />
                <span className="selected-skill-text">Team Totals</span>
                <img
                  src={getIconUrl('Total')}
                  alt="Team Totals"
                  className="selected-skill-icon"
                />
              </div>
              <div className="table-container" data-bs-theme="dark">
                <Table striped bordered hover className="custom-table">
                  <thead>
                    <tr>
                      <th>Place</th>
                      <th>Team</th>
                      <th>Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamTotals.map((team, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{team.teamName}</td>
                        <td>{team.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          ) : selectedSkill && (
            <div>
              <div className="selected-skill-header">
                <img
                  src={getIconUrl(selectedSkill)}
                  alt={selectedSkill}
                  className="selected-skill-icon"
                />
                <span className="selected-skill-text">{formatSkillName(selectedSkill)}</span>
                <img
                  src={getIconUrl(selectedSkill)}
                  alt={selectedSkill}
                  className="selected-skill-icon"
                />
              </div>
              <div className="table-container" data-bs-theme="dark">
                <Table striped bordered hover className="custom-table">
                  <thead>
                    <tr>
                      <th>Place</th>
                      <th>Player</th>
                      <th>Gain</th>
                      <th>Team</th>
                      <th>Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skillData.map((player, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{player.playerName}</td>
                        <td>{player.xpGained}</td>
                        <td>{player.teamName}</td>
                        <td>{player.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          )}
          {selectedHeader && (
            <div>
              <div className="selected-skill-header">
                <span className="selected-skill-text">{selectedHeader}</span>
              </div>
              <div className="table-container" data-bs-theme="dark">
                <Table striped bordered hover className="custom-table">
                  <thead>
                    <tr>
                      <th>Player</th>
                      <th>Team</th>
                      <th>Value</th>
                      <th>Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sheetData.find(category => category.header === selectedHeader).players.map((player, index) => (
                      <tr key={index}>
                        <td>{player.name}</td>
                        <td>{player.team}</td>
                        <td>{player.value}</td>
                        <td>{player.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          )}
        </Col>
        <Col xs={12} md={5} className="text-center">
          <div className="selected-skill-header">
            <span className="selected-skill-text">Top Players</span>
          </div>
          <div className="table-container" data-bs-theme="dark">
            <Table striped bordered hover className="custom-table">
              <thead>
                <tr>
                  <th>Place</th>
                  <th>Player</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {(showSheetButtons ? combinedTopPlayers : topPlayers).map((player, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{player.playerName}</td>
                    <td>{player.points}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default GooseBingo;
