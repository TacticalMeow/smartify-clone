import {
  Divider, Drawer, IconButton, ListItemText, MenuItem, MenuList, Tooltip, Typography,
} from '@mui/material';
import React, { FC } from 'react';
import { Box } from '@mui/system';
import { useMainContext } from 'contexts/MainContext';
import { JobDocumentFields } from '@smarter/shared';
import AddIcon from '@mui/icons-material/Add';

export const sidebarWidth = '240px';

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    // eslint-disable-next-line react/require-default-props
    window?: () => Window;
    jobs: JobDocumentFields[];
    setSelectedJob: (jobId: string) => void;
    selectedJob: string;
    onAdd: () => void;
  }

const SideNavBar: FC<Props> = ({
  window, jobs, setSelectedJob, selectedJob, onAdd,
}) => {
  const { isSidebarOpen, setIsSidebarOpen } = useMainContext();

  const handleDrawerToggle = () => {
    setIsSidebarOpen(false);
  };

  const drawer = (
    <Box sx={{ paddingY: '16px' }}>
      <Divider />
      <Box paddingX={1} paddingTop={2}>
        <Box
          paddingX={1}
          paddingY={2}
          display="flex"
          justifyContent="space-between"
          alignContent="center"
          width="100%"
        >
          <Typography variant="h6">My Jobs</Typography>
          <Tooltip title="Create Job" placement="right">
            <IconButton onClick={onAdd} sx={{ bottom: 5 }}>
              <AddIcon color="primary" />
            </IconButton>
          </Tooltip>
        </Box>

        <MenuList dense sx={{ marginRight: 2, marginLeft: 1 }}>
          {jobs.map((job) => (
            <MenuItem
              key={job._id}
              selected={job._id === selectedJob}
              onClick={() => setSelectedJob(job._id)}
            >
              <ListItemText
                inset
                primaryTypographyProps={{
                  sx: { fontSize: 16 },
                }}
              >
                {job?.name}

              </ListItemText>
            </MenuItem>
          ))}
        </MenuList>
      </Box>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box
      component="nav"
      sx={{ width: { sm: sidebarWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        container={container}
        variant="temporary"
        open={isSidebarOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: sidebarWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: sidebarWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default SideNavBar;
