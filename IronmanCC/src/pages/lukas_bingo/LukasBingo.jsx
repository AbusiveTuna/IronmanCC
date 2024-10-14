import React, { useState, useEffect } from 'react';
import { Modal, Button, Container, Row, Col } from 'react-bootstrap';
import './LukasBingo.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Players from './Players';
import Rules from './Rules';

import lukasTiles from './TileInfo.json';

const LukasBingo = () => {
  const [view, setView] = useState('bothBoards');
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState("");
  const [countsTeamA, setCountsTeamA] = useState(null);
  const [countsTeamB, setCountsTeamB] = useState(null);
  const [sabotageTeamA, setSabotageTeamA] = useState(null);
  const [sabotageTeamB, setSabotageTeamB] = useState(null);

  const handleShow = (modalInfo) => {
    setShowModal(true);
    setModalInfo(modalInfo);
  }
  const handleClose = () => {
    setModalInfo(modalInfo);
    setShowModal(false);
  }

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

  const changeView = (newView) => {
    setView(newView);
  }

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
                if (tileIndex >= lukasTiles.tiles.length) return null;
                const currentTile = lukasTiles.tiles[tileIndex];
                const imageName = currentTile.name;
                const description = currentTile.description;
                const amount = currentTile.totalAmount;
                if (counts == null) {
                  return; //data hasn't loaded yet.
                }
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
                    {currentTile.information != "" && (
                      <img
                        src={`/resources/icons/${encodeURIComponent('info')}.png`}
                        alt="Information"
                        className="bingo-info-icon"
                        onClick={() => handleShow(currentTile.information)}
                        style={{ cursor: 'pointer' }}
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

  const InfoModal = ({ show, handleClose }) => {
    return (
      <Modal className="additonal-info-modal" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Additonal Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalInfo}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <Container className="bingo-container" fluid>
      {view == 'bothBoards' && (
        <Row>
        <Col>{renderGrid('A', countsTeamA, sabotageTeamA)}</Col>
        <Col>{renderGrid('B', countsTeamB, sabotageTeamB)}</Col>
        </Row>
      )}

      {view == 'mongBoard' && (
        <Row>
        <Col>{renderGrid('A', countsTeamA, sabotageTeamA)}</Col>
        </Row>
      )}

      {view == 'falaBoard' && (
        <Row>
        <Col>{renderGrid('B', countsTeamB, sabotageTeamB)}</Col>
        </Row>
      )}

      <Row>
        <Col className="view-buttons">
        <button className={view == "bothBoards" ? "active-lukas-view-button" : "lukas-view-button"} value="bothBoards" onClick={() => changeView('bothBoards')}>Both Boards</button>
        <button className={view == "mongBoard" ? "active-lukas-view-button" : "lukas-view-button"} value="mongBoard" onClick={() => changeView('mongBoard')}>Mong and the Salties Board</button>
        <button className={view == "falaBoard" ? "active-lukas-view-button" : "lukas-view-button"} value="falaBoard" onClick={() => changeView('falaBoard')}>The Faladorable Guards Board</button>
        <button className={view == "players" ? "active-lukas-view-button" : "lukas-view-button"} value="players" onClick={() => changeView('players')}>Players</button>
        <button className={view == "rules" ? "active-lukas-view-button" : "lukas-view-button"} value="rules" onClick={() => changeView('rules')}>Bingo Rules</button>
        </Col>
      </Row>

      {view == 'players' && (
        <Players/>
      )}

      {view == 'rules' && (
        <Rules/>
      )}

      <InfoModal
        show={showModal}
        handleClose={handleClose}
      />
    </Container>

  );
};

export default LukasBingo;
