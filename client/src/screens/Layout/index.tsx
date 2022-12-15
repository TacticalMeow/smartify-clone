import {
  Box,
  CircularProgress, Grid,
} from '@mui/material';
import { useAuthContext } from 'contexts/AuthContext';
import React, { FC, useEffect } from 'react';
import Header from 'screens/Layout/Header';

const Layout: FC = ({ children }) => {
  const { isAuthLoading, refreshAccessToken } = useAuthContext();

  useEffect(() => {
    refreshAccessToken();
  }, []);

  if (isAuthLoading) {
    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh' }}
      >
        Loading some stuff
        <Grid item xs={3}>
          <CircularProgress size={75} />
        </Grid>

      </Grid>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Header />
      <main style={{ backgroundColor: '#000000' }}>
        { children }
      </main>
    </Box>
  );
};

export default Layout;
