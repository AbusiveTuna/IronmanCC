import React from 'react';
import './css/WelcomePage.css';
import discordIcon from '../resources/discord.png';
import RankTable from '../components/RankTable';

const WelcomePage = () => {
  return (
    <div className="welcome-page">
      <h1>Welcome to IronmanCC.com</h1>

      <div className="welcome-page-grid-container">

       <div className="clan-information">
          <h2>Clan Information</h2>
          <p>Part of Ironscape, the IronmanCC was the original friend's chat built as a clan for irons, by irons.</p>
          <p>Today, the IronmanCC is one of the most active, and longest standing clans in OSRS.</p>
          <p>We are open to Irons old and new, whether you're just starting your first iron, or maxed and looking to find new friends to raid with, the IronmanCC has something for everybody.</p>
        </div>

        <div className="discord-info">
          <br></br>
          <h2>Join the Ironscape Discord</h2>
          <div className="discord">
            <img src={discordIcon} alt="Discord" />
            <a href="https://discord.gg/ironscape" target="_blank" rel="noopener noreferrer">Join Ironscape</a>
          </div>
        </div>

        <div className="how-to-join">
            <h2>How To Join</h2>
            <p>Join the <strong>IronmanCC</strong> clan chat in-game</p>
            <p>Applications open for new members on the first of every month, and are open until we hit the in-game limit of 500 members.</p>
            <sub>Note: Applications close whenever we hit 495 members as spots are left open to account for returning players</sub>
            <h2>CC Information</h2>
            <p>CC Ranks follow the table to the right.</p>
            <p>Vouch Ranks are given for being Active, Helpful, and Friendly in the CC.</p>
        </div>

        <div className="toolbar-info">
          <h2>Ironman CC Ranks</h2>
          <RankTable/>
        </div>

      </div>
    </div>
  );
};

export default WelcomePage;
