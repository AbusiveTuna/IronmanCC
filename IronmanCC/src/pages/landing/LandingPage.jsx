import './LandingPage.css';
import RankTable from './RankTable';
import DiscordCard from './DiscordCard';

const LandingPage = () => {
  return (
    <main className="lp-wrapper">
      <section className="lp-hero">
        <h1>Welcome to IronmanCC</h1>
        <p className="lp-tagline">
          One of the longest-standing, most active iron clans in Old School RuneScape.
        </p>
      </section>

      <section className="lp-discord-section">
        <h2>Join our Discords</h2>

        <div className="lp-discords">
          <DiscordCard
            href="https://discord.gg/kW6XDk9PYM"
            label="Ironman CC"
            description="Used for Bingos and other clan events."
          />

          <DiscordCard
            href="https://discord.gg/ironscape"
            label="Ironscape"
            description="The larger Ironscape community hub."
          />
        </div>
      </section>

      <section className="lp-grid">
        <div className="lp-card lp-clan">
          <h2>About the Clan</h2>
          <p>
            Part of <strong>Ironscape</strong>, IronmanCC began as a friend chat for irons, by irons.
            Today we welcome everyone—from fresh accounts to maxed veterans looking for raid teams.
          </p>

          <h3>How to Join</h3>
          <p>
            Applications are almost always open, simply ask a mod to open apps for you.
          </p>

          <h3> Why was I kicked from the CC?</h3>
          <p>
            Unless specfically told a reason by moderators, you were most likely purged from inactivity.
            We do this to keep applications open as we constantly hit the 500 player cap.
            Our inactivity threshold can be as long as two weeks or as short as three days during major releases.
          </p>
          
          <h3>Rules &amp; Guidelines</h3>
          <a
            className="lp-rules-link"
            href="https://i.imgur.com/ri5GsdG.png"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ironscape Rules
          </a>
        </div>

        <div className="lp-card lp-ranks">
          <h2>IronmanCC Rank Table</h2>
          <RankTable />
        </div>
      </section>

    </main>
  );
}

export default LandingPage;
