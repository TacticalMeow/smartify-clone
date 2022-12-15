import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import { FC } from 'react';
import { Box } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';
import { useMainContext } from 'contexts/MainContext';
import { NavbarLogoContainter, NavLogo } from 'screens/Layout/NavbarElements';
import SideBar from './SideBar';

const HeaderNavbar: FC = ({ children }) => (
  <Box sx={{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box',
    flexShrink: '0',
    position: 'fixed',
    zIndex: '1500',
    top: '0px',
    transition: '0.8s all ease',
    backdropFilter: 'blur(20px)',
    background: 'rgba(0.1,0.1,0.1,0.85)',
    color: '#0c0c0c',
  }}
  >
    { children}
  </Box>
);

const Header: FC = () => {
  const { isNavSidebarOpen, setIsNavSidebarOpen } = useMainContext();

  return (
    <HeaderNavbar>
      <NavbarLogoContainter>
        <NavLogo />
      </NavbarLogoContainter>
      <Box sx={{ mr: '10px' }}>
        <IconButton
          onClick={() => setIsNavSidebarOpen(!isNavSidebarOpen)}
          sx={(theme) => ({
            color: theme.palette.secondary.main,
          })}
        >
          <MenuIcon />
        </IconButton>
      </Box>
      <SideBar />
    </HeaderNavbar>
  );
};

export default Header;
