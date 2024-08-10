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
  const teamTimes = ["Ba Speed", "Cox Group 3", "Cox Group 5", "Cox Group 7", "Cox Group Cm 3", "Cox Group Cm 5", "Cox Group Cm 7","Tob 3", "Tob 4", "Tob 5", "HMT 3", "HMT 4", "HMT 5","Toa 2 (300)","Toa 4 (300)","Toa 6+ (300)"]
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
      //makes it so team times arent included in indivdual players points
      if(!teamTimes.includes(category.header)){
        addPlayer(player.name, player.points, player.team, efficiency);
      }
    });
  });

  players.sort((a, b) => b.points - a.points);
  return players;
};

export const calculateCombinedTeamTotals = (responseData, sheetResponseData, purpleData) => {
  const teamPoints = {};

  // Process points from responseData (e.g., temple data)
  for (const teamName in responseData.team_totals) {
    const cleanTeamName = teamName.replace(/'/g, '');
    if (!teamPoints[cleanTeamName]) {
      teamPoints[cleanTeamName] = 0;
    }
    teamPoints[cleanTeamName] += responseData.team_totals[teamName];
  }

  // Process points from sheetResponseData (e.g., speedruns, clues, etc.)
  sheetResponseData.forEach(category => {
    category.players.forEach(player => {
      const cleanTeamName = player.team.replace(/'/g, '');
      if (!teamPoints[cleanTeamName]) {
        teamPoints[cleanTeamName] = 0;
      }
      teamPoints[cleanTeamName] += player.points;
    });
  });

  // Process points from purpleData (e.g., raid purples)
  purpleData.forEach(raid => {
    raid.teams.forEach(team => {
      const cleanTeamName = team.teamName.replace(/'/g, '');
      if (!teamPoints[cleanTeamName]) {
        teamPoints[cleanTeamName] = 0;
      }
      teamPoints[cleanTeamName] += team.points;
    });
  });

  // Convert the teamPoints object to an array and sort by points
  const teamTotalsArray = Object.keys(teamPoints).map(teamName => ({
    teamName,
    points: teamPoints[teamName],
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
