import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => (
  <header className="header">
    <div className="logo-container">
      <img src="/ironman-helm.png" alt="Ironman CC" className="ironman-logo" />
      <h1 className="clan-name">Ironman CC</h1>
    </div>

    <nav className="header-nav">
      <Link to="/" className="header-link">Home</Link>
      <Link to="/" className="header-link">OSRS Tools</Link>
      <Link to="/" className="header-link">RS Themed Games</Link>
      <Link to="/" className="header-link">Did Justen get a Tbow yet?</Link>
      <Link to="/" className="header-link">Current Event</Link>
      <Link to="/" className="header-link">Previous Events</Link>
      <a href="https://templeosrs.com/groups/overview.php?id=2176" className="header-link" target="_blank" rel="noopener noreferrer">
      <img src="/temple.svg" alt="Temple Page" className="header-link-icon" />
      </a>
    </nav>
  </header>
);

export default Header;
