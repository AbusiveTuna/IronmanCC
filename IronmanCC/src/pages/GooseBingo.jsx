import React, { useEffect, useState } from 'react';
import { Button, Table, Container, Row, Col } from 'react-bootstrap';
import { templeMap } from '../common/templeMap';
import axios from 'axios';
import './css/GooseBingo.css';

import 'bootstrap/dist/css/bootstrap.min.css';

const GooseBingo = () => {
  const [data, setData] = useState(null);
  const [sheetData, setSheetData] = useState(null);
  const [skillData, setSkillData] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState('Team Totals');
  const [topPlayers, setTopPlayers] = useState([]);
  const [teamTotals, setTeamTotals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://ironmancc-89ded0fcdb2b.herokuapp.com/results');
        const responseData = response.data;
        setData(responseData);
        calculateTopPlayers(responseData.results); //take this out if we get to standerdize the sheet

        const sheetResponse = await axios.get('https://ironmancc-89ded0fcdb2b.herokuapp.com/fetchSheetData');
        const sheetResponseData = sheetResponse.data.map(category => ({
          ...category,
          players: category.players.map(player => ({
            ...player,
            team: player.team.replace(/'/g, '')
          }))
        }));
        setSheetData(sheetResponseData);

        // Combine team totals from both data sources
        const combinedTeamTotals = calculateCombinedTeamTotals(responseData, sheetResponseData);
        setTeamTotals(combinedTeamTotals);

        //if we ever standerdize the names in the stupid sheet
        // const combinedTopPlayers = calculateTopPlayers(responseData.results, sheetResponseData);
        // setTopPlayers(combinedTopPlayers);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const calculateTopPlayers = (results, sheetData) => {
    const players = [];

    // Process results from initial data
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

    // Process players from sheet data
    sheetData.forEach(category => {
      category.players.forEach(player => {
        const existingPlayer = players.find(p => p.playerName === player.name);
        if (existingPlayer) {
          existingPlayer.points += player.points;
        } else {
          players.push({ playerName: player.name, teamName: player.team, points: player.points });
        }
      });
    });

    const sortedPlayers = players.sort((a, b) => b.points - a.points).slice(0, 10);
    return sortedPlayers;
  };

  const calculateCombinedTeamTotals = (responseData, sheetData) => {
    const teamPoints = {};

    // Process responseData
    for (const teamName in responseData.team_totals) {
      const cleanTeamName = teamName.replace(/'/g, '');
      if (!teamPoints[cleanTeamName]) {
        teamPoints[cleanTeamName] = 0;
      }
      teamPoints[cleanTeamName] += responseData.team_totals[teamName];
    }

    // Process sheetData
    sheetData.forEach(category => {
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
    } else if (data && data.results) {
      const skillData = data.results[skill];
      setSkillData(skillData);
      setSelectedSkill(skill);
    } else {
      console.log('Data not available');
    }
  };

  const formatSkillName = (skill) => {
    return skill.replace(/_/g, ' ');
  };

  const getIconUrl = (skill) => {
    // Special case for Phosani's Nightmare
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
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} md={7} className="text-center">
          {selectedSkill === 'Team Totals' ? (
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
          ) : selectedSkill && (
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
          )}
          {selectedSkill === 'Team Totals' ? (
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
          ) : skillData ? (
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
          ) : (
            <p>Click a button to view the skill data.</p>
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
                {topPlayers.map((player, index) => (
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
