import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { FC } from 'react';

const PresetGenHeadline: FC = () => (
  <Box sx={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  }}
  >
    <Typography
      align="center"
      variant="h1"
    >
      Whats the mood today?
    </Typography>
    <Typography
      align="center"
      variant="subtitle1"
    >
      Make your new playlist by following just these 2 steps!

    </Typography>
  </Box>
);

export default PresetGenHeadline;
