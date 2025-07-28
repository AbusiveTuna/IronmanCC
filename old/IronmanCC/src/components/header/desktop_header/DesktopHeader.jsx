import React from 'react';
import { HeaderLinks } from '../HeaderLinks';
const DesktopHeader = () => {
  return (
    <div className="header desktop-header">
      {/* Map throgh the HeaderLinks and create the relevant anchor tags.*/}
     {Object.entries(HeaderLinks).map(([text, href]) => (
      <a key={text} href={href} target={href.startsWith('http') ? "_blank" : "_self"} rel="noopener noreferrer">
        {text}
      </a>
    ))}
    </div>
  );
};

export default DesktopHeader;