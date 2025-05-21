import { useState, useEffect } from 'react';
import axios from 'axios';
import { calculateTopPlayers, calculateCombinedTopPlayers } from '../pages/everything_bingo/bingoUtils';

const fetchSheetData = (data) => {
  const [sheetData, setSheetData] = useState([]);
  const [topPlayers, setTopPlayers] = useState([]);
  const [combinedTopPlayers, setCombinedTopPlayers] = useState([]);

  useEffect(() => {
    if (data) {
      const fetchSheetData = async () => {
        try {
          const sheetResponse = await axios.get('https://ironmancc-89ded0fcdb2b.herokuapp.com/fetchSheetData');
          const sheetResponseData = sheetResponse.data.map(category => ({
            ...category,
            players: category.players
              .filter(player => typeof player.team === 'string' && !player.team.includes('"type":"N_A"'))
              .map(player => ({
                ...player,
                team: player.team.replace(/'/g, '')
              }))
          }));
          setSheetData(sheetResponseData);

          setTopPlayers(calculateTopPlayers(data.results));
          setCombinedTopPlayers(calculateCombinedTopPlayers(data.results, sheetResponseData));
        } catch (error) {
          console.error('Error fetching sheet data:', error);
        }
      };

      fetchSheetData();
    }
  }, [data]);

  return { sheetData, topPlayers, combinedTopPlayers };
};

export default fetchSheetData;