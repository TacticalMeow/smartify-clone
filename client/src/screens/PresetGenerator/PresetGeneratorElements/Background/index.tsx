import { Box } from '@mui/system';
import React, { FC } from 'react';

const PresetGeneratorBg: FC = ({ children }) => (
  <Box
    sx={(theme) => ({
      background: theme.palette.background.default,
      overflow: 'auto',
      position: 'absolute',
      width: '100%',
      height: '100%',
      gap: '20px',
      display: 'flex',
      justifyContent: 'space-evenly',
      flexDirection: 'column',
      alignItems: 'center',
    })}
  >
    {children}
  </Box>
);

export default PresetGeneratorBg;
