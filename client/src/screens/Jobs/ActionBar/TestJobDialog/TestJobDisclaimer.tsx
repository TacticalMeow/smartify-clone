import {
  Box,
  Button,
  Typography,
} from '@mui/material';
import {
  Endpoints, Flow, TestJobRequest, TestJobResponse, TestJobResult,
} from '@smarter/shared';
import { smartifyClient } from 'apiClients';
import React, { FC } from 'react';
import { TestJobScreenState } from 'screens/Jobs/ActionBar/TestJobDialog/types';

type Props = {
  jobId: string
  setTestJobScreen: (loading: TestJobScreenState) => void
  setResults: (results: TestJobResult) => void
}

const TestJobDisclaimer: FC<Props> = ({ jobId, setTestJobScreen, setResults }) => {
  const handleClick = async () => {
    setTestJobScreen(TestJobScreenState.Loading);

    const flow = JSON.parse(localStorage.getItem(jobId) || '{}') as Flow;

    try {
      const response = await smartifyClient.post<TestJobRequest, TestJobResponse>(
        Endpoints.testJob,
        { id: jobId, flow },
      );
      setTimeout(() => {
        setResults(response.data);
        setTestJobScreen(TestJobScreenState.Results);
      }, 4000);
    } catch (err: any) {
      setTimeout(() => {
        setResults(err.response.data);
        setTestJobScreen(TestJobScreenState.Results);
      }, 4000);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 3,
        height: '25vh',
      }}
    >
      <Box>
        <Typography variant="h4" textAlign="center">
          Press &quot;Next&quot; to start your test !
        </Typography>
      </Box>
      <Box
        mt={4}
        display="flex"
        flexDirection="column"
        justifyContent="flex-end"
        alignItems="flex-end"
        height="100%"
      >
        <Button
          variant="outlined"
          onClick={handleClick}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default TestJobDisclaimer;
