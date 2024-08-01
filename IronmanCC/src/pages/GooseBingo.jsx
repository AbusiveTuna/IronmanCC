import React, { useEffect, useState } from 'react';
import { Button, Table, Container, Row, Col } from 'react-bootstrap';
import { templeMap } from '../common/templeMap';
import './css/GooseBingo.css';

import 'bootstrap/dist/css/bootstrap.min.css';

const GooseBingo = () => {
  const [data, setData] = useState(null);
  const [skillData, setSkillData] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState('');

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
      }
    };
    setData(mockData);
  }, []);

  const handleClick = (skill) => {
    if (data && data.results) {
      const skillData = data.results[skill];
      setSkillData(skillData);
      setSelectedSkill(skill);
    } else {
      console.log('Data not available');
    }
  };

  return (
    <Container className="bingo-container" fluid>
      <Row className="mb-2 justify-content-center mt-4">
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
                style={{ backgroundImage: `url(/resources/osrs_icons/${name}.png)` }}
              />
            </Button>
          </Col>
        ))}
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} md={8} className="text-center">
          {selectedSkill && (
            <div className="selected-skill-header">
              <img
                src={`/resources/osrs_icons/${selectedSkill}.png`}
                alt={selectedSkill}
                className="selected-skill-icon"
              />
              <span className="selected-skill-text">{selectedSkill}</span>
              <img
                src={`/resources/osrs_icons/${selectedSkill}.png`}
                alt={selectedSkill}
                className="selected-skill-icon"
              />
            </div>
          )}
          {skillData ? (
            <div className="table-container">
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