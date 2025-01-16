import React, { useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import './LukasBingo.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import BingoTile from './BingoTile';
import lukasTiles from './TileInfo.json';

const Grid = ({ teamKey, counts, handleShow, updateCompletedTiles }) => {
  const displayName = teamKey === 'A' ? 'Mong and the Salties' : 'The Faladorable Guards';

  useEffect(() => {
    if (counts) {
      const newTileArray = [];
      for (let rowIndex = 0; rowIndex < 7; rowIndex++) {
        for (let colIndex = 0; colIndex < 7; colIndex++) {
          const tileIndex = rowIndex * 7 + colIndex;
          if (tileIndex >= lukasTiles.tiles.length) continue;

          const currentTile = lukasTiles.tiles[tileIndex];
          const currentCount = counts[tileIndex];
          const isComplete = currentTile.totalAmount / currentCount === 1;

          newTileArray.push({
            team: teamKey,
            tileIndex: tileIndex,
            column: colIndex,
            isComplete: isComplete,
          });
        }
      }
      updateCompletedTiles(newTileArray);
    }
  }, [counts]); 

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
              const currentCount = counts ? counts[tileIndex] : null;

              return (
                <BingoTile 
                  key={tileIndex} 
                  currentTile={currentTile} 
                  colIndex={colIndex} 
                  currentCount={currentCount} 
                  handleShow={handleShow} 
                />
              );
            })}
          </Row>
        ))}
      </Container>
    </div>
  );
};

export default Grid;
