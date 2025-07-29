import { AppBar, Toolbar, Box } from '@mui/material';
import HeaderNavButton from './HeaderNavButton';
import navLinks from './headerLinks';

const Header = () => {
  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'var(--secondary-color)' }} elevation={0}>
      <Toolbar variant="dense" sx={{ gap: 2 }}>
        {navLinks.map(({ path, label }) => (
          <HeaderNavButton key={path} to={path}>
            {label}
          </HeaderNavButton>
        ))}

        {/* Forces icon to the right */}
        <Box sx={{ flexGrow: 1 }} />

        <img
          src="ironmanlogo.webp"
          alt="Clan emblem"
          width="40"
          height="40"
          className="header-logo"
        />

      </Toolbar>
    </AppBar>
  );
}

export default Header;