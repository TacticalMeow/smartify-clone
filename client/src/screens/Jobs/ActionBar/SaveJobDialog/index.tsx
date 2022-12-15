import {
  Box,
  Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button,
} from '@mui/material';
import React, {
  FC, useState,
} from 'react';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import { useAuthContext } from 'contexts/AuthContext';

  type Props = {
      open: boolean;
      onClose: () => void;
      jobId?: string;
      saveJobToDb: () => Promise<void>;
  }

const SaveJobDialog: FC<Props> = ({
  open, onClose, jobId, saveJobToDb,
}) => {
  const [isLoading, setLoading] = useState(false);
  const [maximumProcessorError, setMaximumProcessorError] = useState(false);
  const { userConfig } = useAuthContext();

  const handleClose = () => {
    setTimeout(() => {
      onClose();
    }, 100);
  };

  const handleClick = async () => {
    setLoading(true);

    try {
      await saveJobToDb();
      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 1000);
    } catch (err: any) {
      setTimeout(() => {
        setLoading(false);
        if (err.response.status === 400) {
          setMaximumProcessorError(true);
        }
      }, 1000);
    }
  };

  if (!jobId) {
    return <div />;
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
    >
      {maximumProcessorError ? (
        <Box>
          <DialogTitle>
            Save Changes
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="are-you-sure-dialog" color="error">
              You have reached maximum number of processors per job.
              Maximum processors allowed is
              {' '}
              {userConfig.maximumProcessorPerJob}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>

        </Box>
      ) : (
        <Box>
          <DialogTitle>
            Save Changes
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="are-you-sure-dialog">
              Are you sure you want to save your job?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <LoadingButton
              loading={isLoading}
              loadingPosition="start"
              onClick={handleClick}
              startIcon={<SaveIcon />}
              variant="outlined"
              sx={{ margin: 1 }}
            >
              Save your job
            </LoadingButton>
          </DialogActions>

        </Box>
      )}

    </Dialog>
  );
};

export default SaveJobDialog;
