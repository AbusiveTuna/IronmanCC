const DiscordCard = ({ href, label, description }) => {
  return (
    <a className="lp-discord-card" href={href} target="_blank" rel="noopener noreferrer">
      <img src="/discord.png" alt="Discord logo" />
      <div>
        <strong>{label}</strong>
        <p>{description}</p>
      </div>
    </a>
  );
}

export default DiscordCard;