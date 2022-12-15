import { Button, Typography } from '@mui/material';
import { useAuthContext } from 'contexts/AuthContext';
import React, { FC } from 'react';
import { HeroBg, HeroContainer, VideoBg } from './HeroElements';

const HeroSection : FC = () => {
  const { loginUrl, isAuthenticated } = useAuthContext();

  return (
    <HeroContainer>
      <HeroBg>
        <VideoBg loop mute videoSrc="/Videos/homevid.mp4" type="video/mp4" autoPlay />
      </HeroBg>
      <Typography sx={{ zIndex: 1000, margin: '5px' }} variant="h1" align="center">
        New Playlists anytime you want
      </Typography>
      <Typography variant="h2" sx={{ zIndex: 1000, margin: '20px' }} align="center">
        {' '}
        customize and schedule a playlist generator for spotify!
        {' '}
      </Typography>
      {!isAuthenticated
      && (
      <Button
        href={loginUrl}
        variant="contained"
        size="large"
        sx={(theme) => ({
          width: '200px',
          alignSelf: 'center',
          background: '#17d161',
          color: theme.palette.common.white,
          margin: '40px',
        })}
      >
        LOGIN WITH SPOTIFY
      </Button>
      )}
    </HeroContainer>
  );
};

export default HeroSection;
