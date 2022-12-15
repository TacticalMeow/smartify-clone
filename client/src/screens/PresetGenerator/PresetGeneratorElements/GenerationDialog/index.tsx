import {
  Box,
  Dialog, DialogTitle, IconButton, DialogContent,
} from '@mui/material';
import React, {
  FC,
} from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Loading from 'screens/Jobs/ActionBar/TestJobDialog/Loading';
import { GenerationDialogState } from 'screens/PresetGenerator/types';
import GeneratorResults from './GeneratorResults';

  type Props = {
      open: boolean;
      onClose: () => void;
      generationDialogScreenState:GenerationDialogState;
      setGenerationDialogScreenState: (state: GenerationDialogState) => void;
  }

const GenerateJobDialog: FC<Props> = ({
  open,
  onClose, generationDialogScreenState,
  setGenerationDialogScreenState,
}) => {
  const handleClose = (event: any, reason: string) => {
    if (reason && reason === 'backdropClick' && generationDialogScreenState === GenerationDialogState.Loading) {
      return;
    }
    setGenerationDialogScreenState(GenerationDialogState.Idle);
    onClose();
  };

  const renderScreenState = () => {
    switch (generationDialogScreenState) {
      case GenerationDialogState.Loading:
        return <Loading />;
      case GenerationDialogState.Done:
        return (
          <GeneratorResults />
        );
      default:
        return <Loading />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
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
          Auto Generator
          {
              generationDialogScreenState !== GenerationDialogState.Loading
              && (
              <IconButton
                aria-label="close"
                onClick={() => {
                  onClose();

                  setTimeout(() => {
                    setGenerationDialogScreenState(GenerationDialogState.Idle);
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
            display: 'flex',
            justifyContent: 'space-evenly',
            flexDirection: 'row',
            [theme.breakpoints.up('sm')]: {
              minHeight: '30vh',
              maxHeight: '55vh',
            },
            [theme.breakpoints.up(2500)]: {
              maxHeight: '45vh',
            },
          })}
        >
          {renderScreenState()}
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default GenerateJobDialog;
