import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './JustenMeme.css';

const JustenMeme = () => {
  const [playerStats, setPlayerStats] = useState({ kc: null, rank: null });

  useEffect(() => {
    document.body.classList.add('justen-meme-page');

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
      <h1>YES!</h1>
      {playerStats.kc !== null && playerStats.rank !== null ? (
        <div className="justenTbowStats">
          <p>Justen got his tbow after 3843 Chambers on 10/26/24</p>
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
