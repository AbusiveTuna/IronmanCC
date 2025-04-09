import React from 'react';
import { useDrop } from 'react-dnd';

const Team = ({ team, onDropPlayer }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'player',
    drop: (item) => {
      onDropPlayer(item.player, team.id);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className="team-container"
      style={{
        backgroundColor: isOver ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
      }}
    >
      <h3 className="team-name">{team.name}</h3>
      <div className="team-roster">
        {team.members.map((player) => (
          <TeamMember key={player.name} player={player} teamId={team.id} />
        ))}
      </div>
    </div>
  );
};

export default Team;

import { useDrag } from 'react-dnd';

const TeamMember = ({ player, teamId }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'player',
    item: {
      player,
      fromTeamId: teamId,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="team-player"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
      }}
    >
      {player.name}
    </div>
  );
};
