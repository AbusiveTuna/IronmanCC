import React, {useState} from 'react';
import { Form, Button, Container, Alert } from "react-bootstrap";
import './gameboard/GameBoard.css';

const NewGame = () => {
    const [captainOne, setCaptainOne] = useState("");
    const [teamOne, setTeamOne] = useState("");
    const [captainTwo, setCaptainTwo] = useState("");
    const [teamTwo, setTeamTwo] = useState("");
    const [gameLinks, setGameLinks] = useState(null);

    const handleSubmit = async(e) => {
        e.preventDefault();
        const response = await fetch("https://ironmancc-89ded0fcdb2b.herokuapp.com/battleship-new-game", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              captainOne,
              teamOne,
              captainTwo,
              teamTwo,
            }),
          });
    
          const data = await response.json();

        const {competionId, captainOneId, captainTwoId} = data;
        setGameLinks({
            captainOneLink: `/setup/${captainOneId}`,
            captainTwoLink: `/setup/${captainTwoId}`,
        });
    
    };

    return (
        <div className="battleship-setup-page">
        <Container className="mt-4">
          <h2>Team Registration</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="captainNameOne" className="mb-3">
              <Form.Label>Captain's Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter captain's name"
                value={captainOne}
                onChange={(e) => setCaptainOne(e.target.value)}
              />
            </Form.Group>
    
            <Form.Group controlId="teamNameOne" className="mb-3">
              <Form.Label>Team Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter team name"
                value={teamOne}
                onChange={(e) => setTeamOne(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="captainNameTwo" className="mb-3">
              <Form.Label>Captain's Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter captain's name"
                value={captainTwo}
                onChange={(e) => setCaptainTwo(e.target.value)}
              />
            </Form.Group>
    
            <Form.Group controlId="teamNameTwo" className="mb-3">
              <Form.Label>Team Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter team name"
                value={teamTwo}
                onChange={(e) => setTeamTwo(e.target.value)}
              />
            </Form.Group>
    
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>

          {gameLinks && (
        <div className="mt-4">
          <Alert variant="success">
            <p>Game Created! Send these links to the captains:</p>
            <ul>
              <li>
                <a href={gameLinks.captainOneLink} target="_blank" rel="noopener noreferrer">
                  Captain One Setup
                </a>
              </li>
              <li>
                <a href={gameLinks.captainTwoLink} target="_blank" rel="noopener noreferrer">
                  Captain Two Setup
                </a>
              </li>
            </ul>
          </Alert>
        </div>
      )}

        </Container>
        </div>
      );
};

export default NewGame;