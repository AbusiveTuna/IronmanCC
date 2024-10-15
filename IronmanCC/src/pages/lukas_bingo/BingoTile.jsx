import React from 'react';
import { Col } from 'react-bootstrap';

const BingoTile = ({ currentTile, colIndex, currentCount, isSabotaged, handleShow }) => {
  const getIconUrl = (imageName) => {
    return `/resources/bingo/${encodeURIComponent(imageName)}.png`;
  };

  const imageName = currentTile.name;
  const description = currentTile.description;
  const amount = currentTile.totalAmount;

  let tileProgress = '';
  if (currentCount > 0) {
    tileProgress = '-inprogress';
  }
  if (currentCount >= amount) {
    tileProgress = '-complete';
  }
  const tileClass = 'tile' + tileProgress;

  return (
    <Col
      key={colIndex}
      className={`bingo-tile ${tileClass}`}
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
  
};

export default BingoTile;