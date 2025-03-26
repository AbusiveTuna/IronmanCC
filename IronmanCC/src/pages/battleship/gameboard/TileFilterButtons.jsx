import React from 'react';
import './TileFilterButtons.css';

const TileFilterButtons = ({ handleToggleCompleted, handleToggleUnrevealed, hideCompleted, hideUnrevealed }) => {

  return (
    <div className="battleship-tiles-button-group">
      <button
        className="battleship-tiles-toggle-button"
        onClick={handleToggleCompleted}
      >
        {hideCompleted ? "Show Completed Tiles" : "Hide Completed Tiles"}
      </button>
      <button
        className="battleship-tiles-toggle-button"
        onClick={handleToggleUnrevealed}
      >
        {hideUnrevealed ? "Show Unrevealed Tiles" : "Hide Unrevealed Tiles"}
      </button>
    </div>
  );
};

export default TileFilterButtons;