import {
  CircularProgress, Grid,
} from '@mui/material';
import { STATE } from 'consts';
import { useAuthContext } from 'contexts/AuthContext';
import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginCallback: FC = () => {
  const { getToken, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    const stateFromUrl = new URLSearchParams(window.location.search).get('state');

    if (code && stateFromUrl === localStorage.getItem(STATE)) {
      getToken(code);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated]);

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: (theme: any) => theme.custom.containerHeight }}
    >

      <Grid item xs={3}>
        <CircularProgress size={50} />
      </Grid>

    </Grid>
  );
};

export default LoginCallback;
