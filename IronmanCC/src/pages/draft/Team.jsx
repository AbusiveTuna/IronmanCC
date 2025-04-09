import React from 'react';
import { useDrop } from 'react-dnd';
import TeamMember from './TeamMember';

const Team = ({ team, onDropPlayer }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'player',
    canDrop: (item) => item.fromTeamId === null,
    drop: (item) => {
      onDropPlayer(item.player, team.id);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: monitor.canDrop(),
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