import React from 'react';
import './Legend.css';

const Legend = () => {
  return (
    <div className="battleship-tiles-legend">
      <div className="battleship-legend-item">
        <span className="battleship-legend-color-box green" />
        Early Game
      </div>
      <div className="battleship-legend-item">
        <span className="battleship-legend-color-box yellow" />
        Mid Game
      </div>
      <div className="battleship-legend-item">
        <span className="battleship-legend-color-box red" />
        Late Game
      </div>
      <div className="battleship-legend-item">
        <span className="battleship-legend-color-box purple" />
        Long/Passive Tile
      </div>
    </div>
  );
};

export default Legend;