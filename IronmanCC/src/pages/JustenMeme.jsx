import React, { useEffect } from 'react';


import './css/JustenMeme.css';

const JustenMeme = () => {
  useEffect(() => {
    document.body.classList.add('justen-meme-page');

    return () => {
      document.body.classList.remove('justen-meme-page');
    };
  }, []);

  return (
    <div>
      <h1>No</h1>
    </div>
  );
};

export default JustenMeme;