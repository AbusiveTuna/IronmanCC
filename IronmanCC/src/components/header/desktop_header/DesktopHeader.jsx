import { HeaderLinks } from '../HeaderLinks';
const DesktopHeader = () => {
  return (
    <div className="header desktop-header">
     {Object.entries(HeaderLinks).map(([text, href]) => (
      <a key={text} href={href} target={href.startsWith('http') ? "_blank" : "_self"} rel="noopener noreferrer">
        {text}
      </a>
    ))}
    </div>
  );
};

export default DesktopHeader;