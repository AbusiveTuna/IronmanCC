import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/JustenMeme.css';

const JustenMeme = () => {
  const [playerStats, setPlayerStats] = useState({ kc: null, rank: null });

  useEffect(() => {
    document.body.classList.add('justen-meme-page');

    // Fetch KC and Rank from your API
    const fetchPlayerStats = async () => {
      try {
        const response = await axios.get('https://ironmancc-89ded0fcdb2b.herokuapp.com/justenTbow'); 
        if (response.data) {
          setPlayerStats({
            kc: response.data.kc,
            rank: response.data.rank,
          });
        }
      } catch (error) {
        console.error('Error fetching player stats:', error);
      }
    };

    fetchPlayerStats();

    return () => {
      document.body.classList.remove('justen-meme-page');
    };
  }, []);

  return (
    <div>
      <h1>No</h1>
      {playerStats.kc !== null && playerStats.rank !== null ? (
        <div className="justenTbowStats">
          <p>Chambers of Xeric KC: {playerStats.kc}</p>
          <p>Rank: {playerStats.rank}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default JustenMeme;
