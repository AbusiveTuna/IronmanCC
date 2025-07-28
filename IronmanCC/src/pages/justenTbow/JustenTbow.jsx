import { useEffect } from 'react';

const JustenTbow = () => {
  useEffect(() => {
    document.body.classList.add('justen-meme-page');
    return () => {
      document.body.classList.remove('justen-meme-page');
    };
  }, []);

  return (
    <div>
        <div className="justenTbowStats">
          <p>After...</p>
          <p>Reaching Rank 13 for Irons</p>
          <p>147 Purples</p>
          <p>and 900 days</p>
          <p>Justen got his tbow after 3843 Chambers on 10/26/24</p>
          <img src="justenTbow.png" alt="justenTbow" />
        </div>
    </div>
  );
};

export default JustenTbow;
