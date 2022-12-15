import {
  Box,
  Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,
} from '@mui/material';
import React, {
  FC, useState,
} from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import RestoreIcon from '@mui/icons-material/Restore';

  type Props = {
      open: boolean;
      onClose: () => void;
      jobId: string;
      restoreJobFromDb: () => void;
  }

const RestoreJobDialog: FC<Props> = ({
  open, onClose, jobId, restoreJobFromDb,
}) => {
  const [isLoading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    setTimeout(async () => {
      try {
        await restoreJobFromDb();
        setLoading(false);
        onClose();
      } catch (err: any) {
        setLoading(false);
        onClose();
      }
    }, 500);
  };

  const handleClose = () => {
    setTimeout(() => {
      onClose();
    }, 100);
  };

  if (!jobId) {
    return <div />;
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <Box>
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        >
          Restore Job
        </DialogTitle>
        <DialogContent sx={{ marginRight: 2 }}>
          <DialogContentText id="are-you-sure-dialog">
            Are you sure you want to restore your job? any unsaved changes will be lost
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            loading={isLoading}
            loadingPosition="start"
            onClick={handleClick}
            startIcon={<RestoreIcon />}
            variant="outlined"
            sx={{ margin: 1 }}
          >
            Restore Job
          </LoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default RestoreJobDialog;
