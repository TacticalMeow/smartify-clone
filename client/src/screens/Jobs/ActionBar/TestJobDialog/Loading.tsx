import {
  Box, Typography, Fade,
} from '@mui/material';
import React, {
  useEffect, useState,
} from 'react';
import LoadingMusic from 'components/LoadingMusic';

const Loading = () => {
  const [fade, setFade] = useState<boolean>(true);
  const [wordIndex, setWordIndex] = useState(0);

  const words = ['Collecting tracks', 'Filtering, Merging and doing a lot of staff', 'Creating your new playlist', 'Cleaning your mess'];

  useEffect(() => {
    const fadeInterval = setInterval(() => {
      setFade((prev) => !prev);
      setTimeout(() => {
        setWordIndex((prev) => prev + 1);
        setFade((prev) => !prev);
      }, 800);
    }, 2000);

    return () => {
      clearInterval(fadeInterval);
    };
  }, []);

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      height: '75%',
    }}
    >
      <Box padding={3}>
        <LoadingMusic />
      </Box>
      <Fade in={fade} timeout={500}>
        <Typography variant="h5">{`${wordIndex < 3 ? words[wordIndex] : words[3]}...`}</Typography>
      </Fade>
    </Box>
  );
};

export default Loading;
