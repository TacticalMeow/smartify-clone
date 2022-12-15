import React from 'react';
import { Box } from '@mui/material';

const LoadingMusic = () => (
  <Box sx={(theme) => ({
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100px',
    height: '100px',

    '@keyframes bounce': {
      '10%': {
        transform: 'scaleY(0.3)',
      },

      '30%': {
        transform: 'scaleY(1)',
      },

      '60%': {
        transform: 'scaleY(0.5)',
      },

      '80%': {
        transform: 'scaleY(0.75)',
      },

      '100%': {
        transform: 'scaleY(0.6)',
      },
    },

    '& > span': {
      width: '14px',
      height: '100%',
      backgroundColor: theme.palette.primary.light,
      borderRadius: '3px',
      transformOrigin: 'bottom',
      animation: 'bounce 2.2s ease infinite alternate',
      content: '" "',

      '&:nth-of-type(2)': {
        animationDelay: '-2.2s',
      },

      '&:nth-of-type(3)': {
        animationDelay: '-3.7s',
      },

      '&:nth-of-type(4)': {
        animationDelay: '-4.3s',
      },

      '&:nth-of-type(5)': {
        animationDelay: '-5.6s',
      },
    },
  })}
  >
    <span />
    <span />
    <span />
    <span />
    <span />
  </Box>
);

export default LoadingMusic;
