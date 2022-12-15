import {
  ListItemIcon, MenuItem, MenuList, Paper, Tooltip,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { FC } from 'react';
import { sidebarWidth } from 'screens/Jobs/SideNavBar';
import AddProcessorIcon from '@mui/icons-material/AddCard';
import TestIcon from '@mui/icons-material/PlayArrow';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import RestoreIcon from '@mui/icons-material/Replay';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ImportIcon from '@mui/icons-material/FileUpload';
import ExportIcon from '@mui/icons-material/FileDownload';

export enum ActionBarOptions {
    AddProcessor = 'ADD_PROCESSOR',
    TestJob = 'TEST_JOB',
    Schedule = 'SCHEDULE',
    SaveJob = 'SAVE_JOB',
    RestoreJob='RESTORE_JOB',
    Settings='SETTINGS'
}

type Props = {
    setAction: (action: ActionBarOptions) => void;
    jobId: string,
    onJobRestore: () => void
}

const ActionBar: FC<Props> = ({ jobId, setAction, onJobRestore }) => {
  const exportJob = () => {
    const jobFlow = localStorage.getItem(jobId);
    const fileData = JSON.stringify(jobFlow);
    const blob = new Blob([fileData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${jobId}.json`;
    link.href = url;
    link.click();
  };

  const importJob = (event: any) => {
    const reader = new FileReader();

    reader.onload = () => {
      const content = reader.result;
      const flow = JSON.parse(content as string);
      localStorage.setItem(jobId, flow);
      onJobRestore();
    };

    reader.readAsText(event.target.files[0]);
  };

  return (
    <Box sx={(theme) => ({
      [theme.breakpoints.down('sm')]: {
        width: '100vw',
      },
      width: `calc(100vw - ${sidebarWidth})`,
      position: 'absolute',
      zIndex: 1100,
      top: '100px',
      right: '0px',
      display: 'flex',
      justifyContent: 'center',
    })}
    >
      <Paper sx={(theme) => ({
        boxShadow: 3,
        borderColor: theme.palette.primary.main,
        border: '1px solid #132F4C',
        [theme.breakpoints.down('sm')]: {
          height: 50,
          width: '100%',
        },
        [theme.breakpoints.up('sm')]: {
          height: 50,
          width: 535,
        },
      })}
      >
        <MenuList sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center',

          '& .MuiMenuItem-root': {
            borderRight: '1px solid #132F4C',
            justifyContent: 'center',
            margin: '-1px',

            '&:first-of-type': {
              borderRadius: '9px 0 0 9px',
            },

            '&:last-of-type': {
              borderRadius: '0 9px 9px 0',
            },
          },

          '& > *': {
            height: '100%',
          },

          '& .MuiListItemIcon-root': {
            display: 'flex',
            justifyContent: 'center',
          },
        }}
        >
          <Tooltip title="Add Processor">
            <MenuItem
              onClick={() => setAction(ActionBarOptions.AddProcessor)}
            >
              <ListItemIcon>
                <AddProcessorIcon />
              </ListItemIcon>
            </MenuItem>
          </Tooltip>
          <Tooltip title="Run Job">
            <MenuItem onClick={() => setAction(ActionBarOptions.TestJob)}>
              <ListItemIcon>
                <TestIcon />
              </ListItemIcon>
            </MenuItem>
          </Tooltip>
          <Tooltip title="Save Changes">
            <MenuItem onClick={() => setAction(ActionBarOptions.SaveJob)}>
              <ListItemIcon>
                <SaveIcon />
              </ListItemIcon>
            </MenuItem>
          </Tooltip>
          <Tooltip title="Restore">
            <MenuItem onClick={() => setAction(ActionBarOptions.RestoreJob)}>
              <ListItemIcon>
                <RestoreIcon />
              </ListItemIcon>
            </MenuItem>
          </Tooltip>
          <Tooltip title="Set Schedule">
            <MenuItem onClick={() => setAction(ActionBarOptions.Schedule)}>
              <ListItemIcon>
                <ScheduleIcon />
              </ListItemIcon>
            </MenuItem>
          </Tooltip>
          <Tooltip title="Download Job">
            <MenuItem onClick={() => exportJob()}>
              <ListItemIcon>
                <ExportIcon />
              </ListItemIcon>
            </MenuItem>
          </Tooltip>
          <Tooltip title="Upload Job">
            <MenuItem onClick={() => (document.getElementById('uploadFile') as any).click()}>
              <input
                id="uploadFile"
                type="file"
                style={{ display: 'none' }}
                onChange={importJob}
              />
              <ListItemIcon>
                <ImportIcon />
              </ListItemIcon>
            </MenuItem>
          </Tooltip>
          <Tooltip title="Settings">
            <MenuItem onClick={() => setAction(ActionBarOptions.Settings)}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
            </MenuItem>
          </Tooltip>
        </MenuList>
      </Paper>
    </Box>
  );
};

export default ActionBar;
