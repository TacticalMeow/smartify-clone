import { Box, Typography } from '@mui/material';
import React, {
  FC,
} from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const GeneratorResults: FC = () => (
  <Box sx={{
    display: 'flex', gap: '25px', justifyContent: 'center', height: '100%',
  }}
  >
    <Typography variant="h4">All done! check your spotify for your new playlist</Typography>
    <CheckCircleIcon fontSize="large" color="success" />
  </Box>
);

export default GeneratorResults;
