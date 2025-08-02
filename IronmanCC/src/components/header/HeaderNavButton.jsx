import { NavLink } from 'react-router-dom';
import {Button } from '@mui/material';

const NavButton = ({ to, children }) => {
  return (
    <Button
      component={NavLink}
      to={to}
      color="inherit"
      sx={{
        textTransform: 'none',
        fontWeight: 600,
        '&.active': { color: 'var(--accent-color-light)' }
      }}
    >
      {children}
    </Button>
  );
}

export default NavButton;