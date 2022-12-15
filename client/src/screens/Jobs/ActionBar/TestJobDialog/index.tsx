import {
  Box,
  Dialog, DialogTitle, IconButton, DialogContent,
} from '@mui/material';
import React, {
  FC, useState,
} from 'react';
import { JobDocumentFields, TestJobResult } from '@smarter/shared';
import TestJobDisclaimer from 'screens/Jobs/ActionBar/TestJobDialog/TestJobDisclaimer';
import { TestJobScreenState } from 'screens/Jobs/ActionBar/TestJobDialog/types';
import CloseIcon from '@mui/icons-material/Close';
import Loading from 'screens/Jobs/ActionBar/TestJobDialog/Loading';
import Results from 'screens/Jobs/ActionBar/TestJobDialog/Results';
import { useReactFlow } from 'react-flow-renderer';

type Props = {
    open: boolean;
    onClose: () => void;
    activeJob?: JobDocumentFields;
}

const TestJobDialog: FC<Props> = ({ open, onClose, activeJob }) => {
  const [testJobScreenState, setTestJobScreenState] = useState<TestJobScreenState>(
    TestJobScreenState.Filters,
  );
  const [testJobResults, setTestJobResults] = useState<TestJobResult>();
  const [shouldFadeDialog, setShouldFadeDialog] = useState(false);
  const { setEdges, setNodes } = useReactFlow();

  const handleClose = (event: any, reason: string) => {
    if (reason && reason === 'backdropClick' && testJobScreenState === TestJobScreenState.Loading) {
      return;
    }

    onClose();

    setTimeout(() => {
      setTestJobScreenState(TestJobScreenState.Filters);
      setTestJobResults(undefined);
    }, 100);
  };

  if (!activeJob) {
    return <div />;
  }

  const renderScreenState = () => {
    switch (testJobScreenState) {
      case TestJobScreenState.Filters:
        return (
          <TestJobDisclaimer
            jobId={activeJob._id}
            setTestJobScreen={setTestJobScreenState}
            setResults={setTestJobResults}
          />
        );
      case TestJobScreenState.Loading:
        return <Loading />;

      case TestJobScreenState.Results:

        return (
          <div>
            {testJobResults && (
            <Results
              jobResults={testJobResults}
              setShouldFadeDialog={setShouldFadeDialog}
            />
            )}
          </div>
        );
      default:
        return <Loading />;
    }
  };

  const handleMouseUp = () => {
    setShouldFadeDialog(false);
    setNodes((prevNodes) => prevNodes.map((node) => ({
      ...node,
      selected: false,
    })));
    setEdges((prevEdges) => prevEdges.map((edge) => ({
      ...edge,
      selected: false,
      animated: false,
    })));
  };

  return (
    <Dialog
      onMouseUp={handleMouseUp}
      open={open}
      onClose={handleClose}
      maxWidth={testJobScreenState === TestJobScreenState.Results ? 'md' : 'sm'}
      fullWidth
      PaperProps={{
        sx: {
          opacity: shouldFadeDialog ? 0 : 1,
          transition: 'visibility 0s 1s, opacity 0.3s linear',
        },
      }}
    >
      <Box>
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        >
          Test your job
          {
            testJobScreenState !== TestJobScreenState.Loading
            && (
            <IconButton
              aria-label="close"
              onClick={() => {
                onClose();

                setTimeout(() => {
                  setTestJobScreenState(TestJobScreenState.Filters);
                  setTestJobResults(undefined);
                }, 100);
              }}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            )
          }
        </DialogTitle>
        <DialogContent
          sx={(theme) => ({
            [theme.breakpoints.up('sm')]: {
              minHeight: '30vh',
              maxHeight: '55vh',
            },
            [theme.breakpoints.up(2500)]: {
              maxHeight: '45vh',
            },
            overflow: 'auto',
          })}
        >
          {renderScreenState()}
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default TestJobDialog;
