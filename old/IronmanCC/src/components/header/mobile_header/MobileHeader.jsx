import React, { useState } from 'react';
import menuIcon from '../../../resources/images/menuIcon.svg';
import closeIcon from '../../../resources/images/closeIcon.svg';
import { HeaderLinks } from '../HeaderLinks';

const MobileHeader = () => {
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);

  return (
    <div className="mobile-header-container">
      <div className="header mobile-header">
        <button className="hamburger-menu-button" onClick={() => setIsHamburgerMenuOpen(!isHamburgerMenuOpen)} >
          <img src={isHamburgerMenuOpen ? closeIcon : menuIcon} alt="Open Menu Button" />
        </button>
      </div>
      {isHamburgerMenuOpen && (
        <div className="hamburger-menu-links">
          {Object.entries(HeaderLinks).map(([text, href]) => (
            <a
              key={text}
              href={href}
              target={href.startsWith('http') ? "_blank" : "_self"}
              rel="noopener noreferrer"
              onClick={() => setIsHamburgerMenuOpen(false)}
            >
              {text}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileHeader;