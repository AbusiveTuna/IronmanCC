import { useState, useEffect } from 'react';
import {Container, Row, Col } from 'react-bootstrap';
import './LukasBingo.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Players from './Players';
import Rules from './Rules';
import Grid from './Grid';
import TileInfoModal from './TileInfoModal';
import PointsDisplay from './PointsDisplay';

const LukasBingo = () => {
  const [view, setView] = useState('bothBoards');
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState("");
  const [countsTeamA, setCountsTeamA] = useState(null);
  const [countsTeamB, setCountsTeamB] = useState(null);
  const [pointsTeamA, setPointsTeamA] = useState([]);
  const [pointsTeamB, setPointsTeamB] = useState([]);

  const handleShow = (modalInfo) => {
    setShowModal(true);
    setModalInfo(modalInfo);
  }

  const handleClose = () => {
    setModalInfo(modalInfo);
    setShowModal(false);
  }

  const updateCompletedTiles = (tiles) => {
    if(tiles[0].team === "A") {
      calculatePoints(tiles, true);
    } else if(tiles[0].team === "B") {
      calculatePoints(tiles, false);
    }
  }

  const calculatePoints = (tiles, isTeamA) => {
    let points = 0;
    let tilePoints = 0;
    let diagonalPoints = 0;
    let rowPoints = 0;
    let columnPoints = 0;
    for(let i = 0; i < tiles.length; i++) {
      //for every complete tile
      if(tiles[i].isComplete) {
        tilePoints += 1;
      }

      if(i == 0) {
        let diagonalComplete = true;
        for(let diag = 0; diag < tiles.length; diag += 8){
          if(!tiles[diag].isComplete) {
            diagonalComplete = false;
          }
        }

        if(diagonalComplete == true) {
          diagonalPoints += 5;
        }
      }

      if(i == 6) {
        let diagonalComplete = true;
        for(let diag = 6; diag < tiles.length; diag += 6){
          if(!tiles[diag].isComplete) {
            diagonalComplete = false;
          }
        }
        
        if(diagonalComplete == true) {
          diagonalPoints += 10;
        }
      }

      if(tiles[i].column == 0){
        let rowComplete = true;

        for(let j = 0; j < 7; j++) {
          if(!tiles[i + j].isComplete){
            rowComplete = false;
          }
        }
        if(rowComplete) {
          rowPoints += 10;
        }
      }

      if(i < 7) {
        let columnComplete = true;
        for(let j = i; j < tiles.length; j += 7){
          if(!tiles[j].isComplete){
            columnComplete = false;
          }
        }

        if(columnComplete) {
          columnPoints += 10;
        }
      }
    }

    points = tilePoints + diagonalPoints + rowPoints + columnPoints;

    if(isTeamA){
      setPointsTeamA(points);
    } else {
      setPointsTeamB(points);
    }
    // console.log('Tile Points: ' + tilePoints);
    // console.log('Diagonal Points: ' + diagonalPoints);
    // console.log('Row Points: ' + rowPoints);
    // console.log('Column Points: ' + columnPoints);
    // console.log('Total Points: ' + points);
  }

  useEffect(() => {
    axios
      .get('https://ironmancc-89ded0fcdb2b.herokuapp.com/lukas-data')
      .then((response) => {
        const { teamA, teamB } = response.data;
        setCountsTeamA(teamA.map((item) => item.count));
        setCountsTeamB(teamB.map((item) => item.count));
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
          <Col>
          <Grid teamKey={'A'} counts={countsTeamA} handleShow={handleShow} updateCompletedTiles={updateCompletedTiles}/>
          <PointsDisplay points={pointsTeamA}/>
          </Col>
          <Col>
          <Grid teamKey={'B'} counts={countsTeamB} handleShow={handleShow} updateCompletedTiles={updateCompletedTiles}/>
          <PointsDisplay points={pointsTeamB}/>
          </Col>
        </Row>
      )}

      {view == 'mongBoard' && (
        <Row>
          <Col>
          <Grid teamKey={'A'} counts={countsTeamA} handleShow={handleShow} updateCompletedTiles={updateCompletedTiles}/> 
          <PointsDisplay points={pointsTeamA}/> 
          </Col>
        </Row>
      )}

      {view == 'falaBoard' && (
        <Row>
          <Col>
          <Grid teamKey={'B'} counts={countsTeamB} handleShow={handleShow} updateCompletedTiles={updateCompletedTiles}/>
          <PointsDisplay points={pointsTeamB}/>
          </Col>
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
