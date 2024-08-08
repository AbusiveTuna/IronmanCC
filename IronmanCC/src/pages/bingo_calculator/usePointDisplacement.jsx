import { useState, useEffect } from 'react';

const usePointDisplacement = (playerName, teamName, data) => {
  const pointsDisbursement = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
  const placesToCheck = 5;

  const [optimalPlacement, setOptimalPlacement] = useState({});

  const getPointTotals = (currentData) => {
    if (currentData) {
      const pointMap = new Map();
      for (let i = 0; i < currentData.length; i++) {
        let points = currentData[i].points || 0;
        let teamName = currentData[i].teamName;
        if (!pointMap.get(teamName)) {
          pointMap.set(teamName, points);
        } else {
          let currentPoints = pointMap.get(teamName) + points;
          pointMap.set(teamName, currentPoints);
        }
      }
      return pointMap;
    }
  };

  const calculateDisplacement = (currentData, originalPoints, place, category, tempDisplacement) => {
    const results = JSON.parse(JSON.stringify(currentData));
    for (let i = 0; i < results.length; i++) {
      results[i].points = pointsDisbursement[i];
    }

    const newTotals = getPointTotals(results);

    const jamesNew = newTotals.get(teamName) || 0;
    const jamesOriginal = originalPoints.get(teamName) || 0;

    const pointsGained = jamesNew - jamesOriginal;
    const newPlace = place + 1;

    if (!tempDisplacement[category]) {
      tempDisplacement[category] = [];
    }
    tempDisplacement[category].push({ newPlace, pointsGained });
  };

  const findOptimalPlacement = (displacement) => {
    const optimalPlacement = {};
    for (let category in displacement) {
      const entries = displacement[category];

      // Filter entries with pointsGained >= 10
      const filteredEntries = entries.filter(entry => entry.pointsGained >= 10);

      // Sort by place number
      optimalPlacement[category] = filteredEntries.sort((a, b) => a.newPlace - b.newPlace);
    }
    return optimalPlacement;
  };

  const calculateXpGainNeeded = (currentData, originalXp, place, tempDisplacement, playerName) => {
    const targetPlayer = currentData[place];
    if (!targetPlayer || targetPlayer.playerName === playerName) {
      return null;
    }

    const targetXp = targetPlayer.xpGained || 0;
    const xpGainNeeded = targetXp - originalXp + 1; // +1 to overtake

    return xpGainNeeded > 0 ? xpGainNeeded : 0;
  };

  useEffect(() => {
    if (data && playerName) {
      const results = JSON.parse(JSON.stringify(data.results));
      const tempDisplacement = {};

      for (let category in results) {
        const playerToAdd = {
          playerName: playerName,
          points: 0,
          teamName: teamName,
          xpGained: 0,
        };

        let currentData = results[category];
        currentData = currentData.slice(0, 10);
        const originalPoints = getPointTotals(currentData);

        const filteredData = currentData.filter(player => player.playerName !== playerName);
        const placesToCheckCurrent = Math.min(filteredData.length, placesToCheck);

        for (let i = 0; i < placesToCheckCurrent; i++) {
          const newNumbers = [
            ...filteredData.slice(0, i),
            { ...playerToAdd, points: pointsDisbursement[i] },
            ...filteredData.slice(i)
          ].slice(0, 10);

          calculateDisplacement(newNumbers, originalPoints, i, category, tempDisplacement);

          // Calculate XP gain needed
          const originalXp = currentData.find(p => p.playerName === playerName)?.xpGained || 0;
          const xpGainNeeded = calculateXpGainNeeded(currentData, originalXp, i, tempDisplacement, playerName);
          if (xpGainNeeded !== null) {
            if (!tempDisplacement[category]) {
              tempDisplacement[category] = [];
            }
            tempDisplacement[category][i].xpGainNeeded = xpGainNeeded;
          }
        }
      }

      const optimal = findOptimalPlacement(tempDisplacement);
      setOptimalPlacement(optimal);
    } else {
      setOptimalPlacement({});
    }
  }, [data, playerName]);

  return optimalPlacement;
};

export default usePointDisplacement;
