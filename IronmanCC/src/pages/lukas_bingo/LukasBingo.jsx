import { useState, useEffect } from 'react';
import {Container, Row, Col } from 'react-bootstrap';
import './LukasBingo.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Players from './Players';
import Rules from './Rules';
import Grid from './Grid';
import TileInfoModal from './TileInfoModal';

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

  const changeView = (newView) => {
    setView(newView);
  }

  return (
    <Container className="bingo-container" fluid>
      {view == 'bothBoards' && (
        <Row>
          <Col><Grid teamKey={'A'} counts={countsTeamA} sabotage={sabotageTeamA} handleShow={handleShow}/></Col>
          <Col><Grid teamKey={'B'} counts={countsTeamB} sabotage={sabotageTeamB} handleShow={handleShow}/></Col>
        </Row>
      )}

      {view == 'mongBoard' && (
        <Row>
          <Col><Grid teamKey={'A'} counts={countsTeamA} sabotage={sabotageTeamA} handleShow={handleShow}/></Col>
        </Row>
      )}

      {view == 'falaBoard' && (
        <Row>
          <Col><Grid teamKey={'B'} counts={countsTeamB} sabotage={sabotageTeamB} handleShow={handleShow}/></Col>
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
        <Players />
      )}

      {view == 'rules' && (
        <Rules />
      )}

      <TileInfoModal
        modalInfo={modalInfo}
        show={showModal}
        handleClose={handleClose}
      />
    </Container>

  );
};

export default LukasBingo;
