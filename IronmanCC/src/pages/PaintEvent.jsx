import React from 'react';
import './css/PaintEvent.css';
import { templeMap } from '../common/constants';

const PaintEvent = () => {
  return (
    <div className="grid-container">
      {templeMap.map(([name], index) => (
        <div key={index} className="grid-item">
          <img src={`/resources/osrs_icons/${name}.png`} alt={name} />
          <p>{name}</p>
        </div>
      ))}
    </div>
  );
};

export default PaintEvent;
