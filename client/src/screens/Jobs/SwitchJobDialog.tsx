import {
  Box,
  Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button,
} from '@mui/material';
import React, {
  FC,
} from 'react';

    type Props = {
        open: boolean;
        onClose: () => void;
        jobIdTo: string
        setSelectedJob: (jobId: string) => void;
    }

const SwitchJobDialog: FC<Props> = ({
  open, onClose, jobIdTo, setSelectedJob,
}) => {
  const onClickYes = () => {
    if (jobIdTo) {
      setSelectedJob(jobIdTo);
      onClose();
    }
  };

  const onClickNo = () => {
    if (jobIdTo) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <Box>
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        >
          Unsaved Changes
        </DialogTitle>
        <DialogContent sx={{ marginRight: 2 }}>
          <DialogContentText id="are-you-sure-dialog">
            You have unsaved changes to your current job, are you sure you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClickNo}>No</Button>
          <Button onClick={onClickYes}>Yes</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default SwitchJobDialog;
