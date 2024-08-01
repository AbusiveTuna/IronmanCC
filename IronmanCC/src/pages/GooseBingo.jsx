import React, { useEffect, useState } from 'react';
import { Button, Table, Container, Row, Col } from 'react-bootstrap';
import { templeMap } from '../common/templeMap';
import './css/GooseBingo.css';

import 'bootstrap/dist/css/bootstrap.min.css';

const GooseBingo = () => {
  const [data, setData] = useState(null);
  const [skillData, setSkillData] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState('Team Totals');
  const [topPlayers, setTopPlayers] = useState([]);
  const [teamTotals, setTeamTotals] = useState([]);

  useEffect(() => {
    const mockData = {
      results: {
        Attack: [
          { points: 25, teamName: 'Bobs', xpGained: 11111, playerName: 'me' },
          { points: 18, teamName: 'Bobs2', xpGained: 11110, playerName: 'me2' },
          { points: 15, teamName: 'Bobs3', xpGained: 11109, playerName: 'me3' }
        ],
        Defence: [
          { points: 25, teamName: 'Guardians', xpGained: 22222, playerName: 'defender' },
          { points: 18, teamName: 'Guardians2', xpGained: 22221, playerName: 'defender2' }
        ],
        Strength: [
          { points: 25, teamName: 'Warriors', xpGained: 33333, playerName: 'strongman' },
          { points: 18, teamName: 'Warriors2', xpGained: 33332, playerName: 'strongman2' }
        ]
      },
      team_totals: [
        { teamName: 'Team1', points: 100 },
        { teamName: 'Team2', points: 98 },
        { teamName: 'Team3', points: 95 }
      ]
    };
    setData(mockData);
    calculateTopPlayers(mockData.results);
    setTeamTotals(mockData.team_totals);
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
    if (skill === "Phosani's_Nightmare") {
      skill = "Phosanis_Nightmare";
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




  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get('/api/your-endpoint'); // Replace with your API endpoint
  //       setData(response.data);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);