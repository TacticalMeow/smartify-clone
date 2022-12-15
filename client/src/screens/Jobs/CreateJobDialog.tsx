import {
  DialogActions,
  TextField,
  DialogContentText,
  DialogContent, DialogTitle, Button, Dialog,
} from '@mui/material';
import React, { FC, useState } from 'react';

  type CreateJobDialogProps = {
    open: boolean,
    onClose?: () => void,
    onConfirm: (name: string) => void,
    disabled: boolean
  }

const CreateJobDialog: FC<CreateJobDialogProps> = ({
  open, onClose, onConfirm, disabled,
}) => {
  const [name, setName] = useState('');

  return (
    <Dialog open={open} onClose={onClose}>
      {disabled ? (
        <>
          <DialogTitle>Create New Job</DialogTitle>
          <DialogContent>
            <DialogContentText gutterBottom>
              You have reached the maximum amount of jobs.
            </DialogContentText>

          </DialogContent>
          <DialogActions>
            {onClose && <Button onClick={onClose}>Cancel</Button>}
          </DialogActions>
        </>
      ) : (
        <>
          <DialogTitle>Create New Job</DialogTitle>
          <DialogContent>

            <DialogContentText gutterBottom>
              Give your job a name, you can change it any time you want
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Job name"
              type="text"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </DialogContent>
          <DialogActions>
            {onClose && <Button onClick={onClose}>Cancel</Button>}
            <Button onClick={() => onConfirm(name)}>Create</Button>
          </DialogActions>
        </>
      )}

    </Dialog>
  );
};

export default CreateJobDialog;
