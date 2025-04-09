import React from 'react';
import { useDrop } from 'react-dnd';
import PlayerCard from './PlayerCard';

const PlayerPool = ({ players, setPlayers, onDropFromTeam }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'player',
    drop: (item, monitor) => {
      if (item.fromTeamId) {
        onDropFromTeam(item.player, item.fromTeamId);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const sortedPlayers = [...players].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="player-pool" ref={drop}>
      <h2>Available Players</h2>
      <div
        className="player-pool-list"
        style={{
          backgroundColor: isOver ? 'rgba(255,255,255,0.1)' : 'transparent',
        }}
      >
        {sortedPlayers.map((player) => (
          <PlayerCard key={player.name} player={player} />
        ))}
      </div>
    </div>
  );
};

export default PlayerPool;
