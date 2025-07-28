import React from 'react';
import './LandingPage.css';
import RankTable from './RankTable';

const LandingPage = () => {
  return (
    <div className="welcome-page">
      <h1>Welcome to IronmanCC.com</h1>

      <div className="welcome-page-grid-container">
        <div className="clan-information">
        <h2>Clan Information & How To Join</h2>
          <p>Applications are always open for new members unless we are at max capacity. Simply ask a mod to open applications for you.</p>
          <sub>Note: Applications close whenever we hit 495 members as spots are left open to account for returning players.</sub>
          <h2>CC Information</h2>
          <p>CC Ranks follow the table to the right.</p>
          <p>Vouch Ranks are given for being Active, Helpful, and Friendly in the CC.</p>


          <p>Part of Ironscape, the IronmanCC was the original friend's chat built as a clan for irons, by irons.</p>
          <p>Today, the IronmanCC is one of the most active, and longest standing clans in OSRS.</p>
          <p>We are open to Irons old and new, whether you're just starting your first iron, or maxed and looking to find new friends to raid with, the IronmanCC has something for everybody.</p>
        </div>

        <div className="toolbar-info">
          <h2>Ironman CC Ranks</h2>
          <RankTable />
        </div>

        <div className="discord-info">
          <h2>Join the Event Discord!</h2>
          <div className="discord">
            <img src="/discord.png" alt="Discord" />
            <a href="https://discord.gg/kW6XDk9PYM" target="_blank" rel="noopener noreferrer">IronmanCC Event Server</a>
          </div>
          <p> The event discord is open to everyone, and is primarly used to host events such as "bingos"</p>
          <h2>Join the Ironscape Discord</h2>
          <div className="discord">
            <img src="/discord.png" alt="Discord" />
            <a href="https://discord.gg/ironscape" target="_blank" rel="noopener noreferrer">Join Ironscape</a>
          </div>
          <p> The ironscape discord is the main discord of the larger Iconscape community. While the Ironman CC in general does not have a discord many members use this one.</p>
          <h2>General Ironscape rules/guidelines</h2>
          <a href="https://i.imgur.com/ri5GsdG.png">Ironscape Rules</a>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;