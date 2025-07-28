import { templeMap } from 'common/templeMap';

export const calculateTopPlayers = (results) => {
  const players = [];

  for (const skill in results) {
    results[skill].forEach(player => {
      const rateEntry = templeMap.find(([name]) => name === skill);
      const rate = rateEntry ? rateEntry[4] : 0;
      const efficiency = rate ? (player.xpGained / rate) : 0;

      const existingPlayer = players.find(p => p.playerName === player.playerName);
      if (existingPlayer) {
        existingPlayer.points += player.points;
        existingPlayer.efficiency += efficiency;
      } else {
        players.push({ ...player, efficiency });
      }
    });
  }

  players.sort((a, b) => b.points - a.points);
  return players;
};

export const calculateDataTeamTotals = (responseData) => {
  const teamPoints = {};

  for (const teamName in responseData.team_totals) {
    const cleanTeamName = teamName.replace(/'/g, '');
    if (!teamPoints[cleanTeamName]) {
      teamPoints[cleanTeamName] = 0;
    }
    teamPoints[cleanTeamName] += responseData.team_totals[teamName];
  }

  return Object.keys(teamPoints).map(teamName => ({
    teamName,
    points: teamPoints[teamName]
  })).sort((a, b) => b.points - a.points);
};

export const calculateCombinedTeamTotals = (responseData) => {
  const teamPoints = {};

  for (const teamName in responseData.team_totals) {
    const cleanTeamName = teamName.replace(/'/g, '');
    if (!teamPoints[cleanTeamName]) {
      teamPoints[cleanTeamName] = 0;
    }
    teamPoints[cleanTeamName] += responseData.team_totals[teamName];
  }

  return Object.keys(teamPoints).map(teamName => ({
    teamName,
    points: teamPoints[teamName]
  })).sort((a, b) => b.points - a.points);
};

export const calculateRanks = (players) => {
  players.sort((a, b) => b.points - a.points);
  return players.map((player, index) => ({
    ...player,
    rank: index + 1
  }));
};
