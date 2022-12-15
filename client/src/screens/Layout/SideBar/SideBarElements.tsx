import * as React from 'react';
import {
  Divider,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, SwipeableDrawer,
} from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import InfoIcon from '@mui/icons-material/Info';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { Box } from '@mui/system';
import { FC, useCallback, useMemo } from 'react';
import { useAuthContext } from 'contexts/AuthContext';
import { useMainContext } from 'contexts/MainContext';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';

type ListItem = {
    name: string,
    onClick: ()=>void,
    icon?: FC<any>,
}
type SideBarListProps = {
    items: ListItem[],

}

const SideBarList: FC<SideBarListProps> = ({ items }) => (
  <Box>
    <List sx={{
      display: 'flex',
      flexDirection: 'column',
    }}
    >
      {items.map((item) => (
        <div>
          <ListItem key={item.name} disablePadding sx={{ height: '10%' }}>
            <ListItemButton onClick={item.onClick ? item.onClick : undefined}>
              <ListItemIcon>
                {item.icon ? <item.icon /> : undefined}
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
          <Divider />
        </div>
      ))}
    </List>
  </Box>
);

export const SideBarComponent: FC = () => {
  const { logout } = useAuthContext();
  const { isNavSidebarOpen, setIsNavSidebarOpen, mobile } = useMainContext();
  const navigate = useNavigate();
  const { loginUrl, isAuthenticated } = useAuthContext();

  const aboutItem = useMemo(() => ({
    name: 'About',
    onClick: () => { _.noop(); },
    icon: InfoIcon,
  }), []);

  const sideBarNavigatorFactory = useCallback((
    navigateTo: string,
    extraStuffToDo?: (()=>void)[],
  ) => {
    const func = async () => {
      if (extraStuffToDo) {
        await Promise.all(extraStuffToDo.map((fn) => fn()));
      }
      setIsNavSidebarOpen(false);
      navigate(navigateTo);
    };
    return func;
  }, []);

  const itemsLoggedIn: ListItem[] = useMemo(() => ([
    {
      name: 'Auto Generate',
      onClick: sideBarNavigatorFactory('/presetgen'),
      icon: AutoAwesomeIcon,
    },
    {
      name: 'Sandbox Mode',
      onClick: sideBarNavigatorFactory('/jobs'),
      icon: CreateIcon,
    },
    {
      name: 'Logout',
      onClick: sideBarNavigatorFactory('/', [logout]),
      icon: LoginIcon,
    },
    aboutItem,
  ]), []);

  const itemsLoggedOut : ListItem[] = useMemo(() => ([
    {
      name: 'login',
      onClick: () => { window.location.href = loginUrl; },
      icon: LogoutIcon,
    },
    aboutItem,
  ]), []);

  // eslint-disable-next-line max-len
  const toggleDrawer = useMemo(() => (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event
        && event.type === 'keydown'
        && ((event as React.KeyboardEvent).key === 'Tab'
          || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setIsNavSidebarOpen(open);
  }, []);

  return (
    <SwipeableDrawer
      PaperProps={{
        sx: {
          width: mobile ? '100%' : '10%',
        },
      }}
      sx={{ zIndex: '1800' }}
      anchor={mobile ? 'top' : 'right'}
      open={isNavSidebarOpen}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
    >
      <SideBarList items={isAuthenticated ? itemsLoggedIn : itemsLoggedOut} />
    </SwipeableDrawer>
  );
};
