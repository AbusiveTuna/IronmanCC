import React from 'react';
import { useDrag } from 'react-dnd';

const PlayerCard = ({ player }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'player',
    item: { player, fromTeamId: null },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="player-card"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
      }}
    >
      <div className="player-name">{player.name}</div>
    </div>
  );
};

export default PlayerCard;
