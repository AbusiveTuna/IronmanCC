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

export default TeamMember;