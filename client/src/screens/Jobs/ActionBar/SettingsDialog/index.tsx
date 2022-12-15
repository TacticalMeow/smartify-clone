import * as React from 'react';
import { FC } from 'react';
import {
  Dialog, DialogTitle, DialogContent, TextField, IconButton, Typography, Divider,
} from '@mui/material';
import { Box } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import CloseIcon from '@mui/icons-material/Close';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';

type Props = {
  open: boolean;
  onClose: () => void;
  jobName?: string;
  jobId?: string
  renameJob: (newName: string) => Promise<void>
  deleteJob: () => Promise<void>;
}

const SettingsDialog: FC<Props> = ({
  open, onClose, jobName, renameJob, deleteJob, jobId,
}) => {
  const [isLoadingRename, setLoadingRename] = React.useState(false);
  const [isLoadingDelete, setLoadingDelete] = React.useState(false);
  const [isErrorRename, setIsErrorRename] = React.useState(false);
  const [renameHelperText, setRenameHelperText] = React.useState(' ');
  const [renameNewName, setRenameNewName] = React.useState('');
  const [deleteNameInputField, setDeleteNameInputField] = React.useState('');

  const onCloseHandler = () => {
    setIsErrorRename(false);
    setRenameHelperText(' ');
    setDeleteNameInputField('');
    onClose();
  };

  const handleClickRenameJob = async () => {
    setLoadingRename(true);

    try {
      await renameJob(renameNewName);
      setTimeout(() => {
        setLoadingRename(false);
        setRenameHelperText('Rename Successful!');
      }, 300);
    } catch (error: any) {
      setTimeout(() => {
        const { err } = error.response.data; // as RenameJobResponse looks
        if (err) { setRenameHelperText(err); }
        setIsErrorRename(true);
        setLoadingRename(false);
      }, 300);
    }
  };

  const handleClickDeleteJob = async () => {
    setLoadingDelete(true);

    try {
      await deleteJob();
      setTimeout(() => {
        setLoadingDelete(false);
        onCloseHandler();
      }, 500);
    } catch (err: any) {
      setTimeout(() => {
        setLoadingDelete(false);
      }, 500);
    }
  };

  const onChangeRenameInput = (elem: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setIsErrorRename(false);
    setRenameHelperText(' ');
    setRenameNewName(elem.target.value);
  };

  const onChangeDeleteInput = (elem: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setDeleteNameInputField(elem.target.value);
  };

  if (!jobId) {
    return <div />;
  }

  return (
    <Dialog
      open={open}
      onClose={onCloseHandler}
      fullWidth
    >
      <Box>
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'top',
        }}
        >
          Job Settings
          <IconButton
            aria-label="close"
            onClick={onCloseHandler}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
          >
            <Box paddingX={1}>
              <Typography sx={{ marginBottom: 1 }}>General</Typography>
              <Divider />
            </Box>
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: 3,
            }}
            >
              <TextField
                label="Rename job"
                variant="outlined"
                onChange={onChangeRenameInput}
                sx={{ flexGrow: 1 }}
                error={isErrorRename}
                helperText={renameHelperText}
              />
              <LoadingButton
                disabled={!renameNewName}
                loading={isLoadingRename}
                loadingPosition="start"
                onClick={handleClickRenameJob}
                startIcon={<DriveFileRenameOutlineIcon />}
                variant="outlined"
                sx={{ marginBottom: '20px', height: '58px', marginX: 3 }}
              >
                Rename
              </LoadingButton>
            </Box>
            <Box paddingX={1}>
              <Typography sx={{ marginBottom: 1 }} color="error">Danger Zone</Typography>
              <Divider color="error" />
            </Box>
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: 3,
            }}
            >
              <TextField
                label="Delete job"
                variant="outlined"
                onChange={onChangeDeleteInput}
                helperText={`Enter the jobs full name: ${jobName}`}
                color="error"
                sx={{ flexGrow: 1 }}
              />
              <LoadingButton
                sx={{
                  marginBottom: '20px', height: '58px', marginX: 3, flexGrow: 0,
                }}
                disabled={!(jobName === deleteNameInputField)}
                loading={isLoadingDelete}
                loadingPosition="start"
                onClick={handleClickDeleteJob}
                startIcon={<DeleteIcon />}
                variant="outlined"
                color="error"
              >
                Delete
              </LoadingButton>
            </Box>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default SettingsDialog;
