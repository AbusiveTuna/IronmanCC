import DesktopHeader from "./desktop_header/DesktopHeader"
import MobileHeader from "./mobile_header/MobileHeader";
import './Header.css';

const Header = () => {
  return (
    <>
      <DesktopHeader />
      <MobileHeader />
    </>
  )
}

export default Header;