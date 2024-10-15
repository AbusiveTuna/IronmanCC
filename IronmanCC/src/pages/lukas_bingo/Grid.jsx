import React from 'react';
import { Container, Row } from 'react-bootstrap';
import './LukasBingo.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import BingoTile from './BingoTile';
import lukasTiles from './TileInfo.json';

const Grid = ({ teamKey, counts, sabotage, handleShow }) => {
  const displayName = teamKey === 'A' ? 'Mong and the Salties' : 'The Faladorable Guards';

  return (
    <div className="bingo-grid">
      <h3>{displayName}</h3>
      <Container>
        {[...Array(7)].map((_, rowIndex) => (
          <Row key={rowIndex}>
            {[...Array(7)].map((_, colIndex) => {
              const tileIndex = rowIndex * 7 + colIndex;
              const currentCol = colIndex;
              if (tileIndex >= lukasTiles.tiles.length) return null;
              const currentTile = lukasTiles.tiles[tileIndex];
              if (counts == null) {
                return; //data hasn't loaded yet.
              }
              const currentCount = counts[tileIndex];
              const isSabotaged = sabotage[tileIndex];

              return(
              <BingoTile currentTile={currentTile} colIndex={currentCol} currentCount={currentCount} isSabotaged={isSabotaged} handleShow={handleShow} />
              );
            })}
          </Row>
        ))}
      </Container>
    </div>
  );
};

export default Grid;