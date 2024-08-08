import { templeMap } from '../../common/templeMap';

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

export const calculateCombinedTopPlayers = (results, sheetData) => {
  const players = [];
  const addPlayer = (player, points, team, efficiency) => {
    const existingPlayer = players.find(p => p.playerName.toLowerCase() === player.toLowerCase());
    if (existingPlayer) {
      existingPlayer.points += points;
      existingPlayer.efficiency += efficiency;
    } else {
      players.push({ playerName: player, points, team, efficiency });
    }
  };

  for (const skill in results) {
    results[skill].forEach(player => {
      const rateEntry = templeMap.find(([name]) => name === skill);
      const rate = rateEntry ? rateEntry[4] : 0;
      const efficiency = rate ? (player.xpGained / rate) : 0;
      addPlayer(player.playerName, player.points, player.teamName, efficiency);
    });
  }

  sheetData.forEach(category => {
    category.players.forEach(player => {
      const rateEntry = templeMap.find(([name]) => name === category.header);
      const rate = rateEntry ? rateEntry[4] : 0;
      const efficiency = rate ? (player.value / rate) : 0;
      addPlayer(player.name, player.points, player.team, efficiency);
    });
  });

  players.sort((a, b) => b.points - a.points);
  return players;
};

export const calculateCombinedTeamTotals = (responseData, sheetResponseData) => {
  const teamPoints = {};

  for (const teamName in responseData.team_totals) {
    const cleanTeamName = teamName.replace(/'/g, '');
    if (!teamPoints[cleanTeamName]) {
      teamPoints[cleanTeamName] = 0;
    }
    teamPoints[cleanTeamName] += responseData.team_totals[teamName];
  }

  sheetResponseData.forEach(category => {
    category.players.forEach(player => {
      if (!teamPoints[player.team]) {
        teamPoints[player.team] = 0;
      }
      teamPoints[player.team] += player.points;
    });
  });

  const teamTotalsArray = Object.keys(teamPoints).map(teamName => ({
    teamName,
    points: teamPoints[teamName]
  }));

  return teamTotalsArray.sort((a, b) => b.points - a.points);
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

export const calculateSheetDataTeamTotals = (sheetResponseData) => {
  const teamPoints = {};

  sheetResponseData.forEach(category => {
    category.players.forEach(player => {
      if (!teamPoints[player.team]) {
        teamPoints[player.team] = 0;
      }
      teamPoints[player.team] += player.points;
    });
  });

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
