import * as React from 'react';
import { Box } from '@mui/system';
import { FC } from 'react';
import { Link as LinkR } from 'react-router-dom';
import { Typography } from '@mui/material';

export const Nav :FC = ({ children }) => (
  <Box sx={{
    background: '#000',
    height: '80px',
    marginTop: '-80px',
    display: 'flex',
    alignItems: 'center',
    top: '0',
    position: 'sticky',
    zIndex: '10',
  }}
  >
    {children}
  </Box>

);

export const NavbarLogoContainter: FC = ({ children }) => (
  <Box sx={{
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: '1',
    padding: '0 24px',
    flexGrow: '4',
  }}
  >
    {children}
  </Box>
);

export const NavLogo: FC = () => (
  <LinkR
    style={{ textDecoration: 'none' }}
    to={{ pathname: '/' }}
  >
    <Typography variant="h2" color="white">SMARTIFY</Typography>
  </LinkR>
);
