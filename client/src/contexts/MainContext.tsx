import React, {
  createContext, useContext, FC, useMemo, useState,
} from 'react';
import _ from 'lodash';
import { useMediaQuery } from '@mui/material';

type MainContextResult = {
    isNavSidebarOpen: boolean,
    setIsNavSidebarOpen: (navSidebar: boolean) =>void,
    isSidebarOpen: boolean,
    setIsSidebarOpen: (sidebar: boolean) => void,
    mobile: boolean,
  }

const MainContext = createContext({
  isNavSidebarOpen: false,
  setIsNavSidebarOpen: (navSidebar: boolean) => _.noop(navSidebar),
  isSidebarOpen: false,
  setIsSidebarOpen: (sidebar: boolean) => _.noop(sidebar),
  mobile: false,
});

const MainContextProvider: FC = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNavSidebarOpen, setIsNavSidebarOpen] = useState(false);
  const mobile = useMediaQuery('(max-width:600px)');

  return (
    <MainContext.Provider
      value={useMemo(() => ({
        isNavSidebarOpen,
        setIsNavSidebarOpen,
        isSidebarOpen,
        setIsSidebarOpen,
        mobile,
      }), [isSidebarOpen, setIsSidebarOpen, isNavSidebarOpen, setIsNavSidebarOpen])}
    >
      { children }
    </MainContext.Provider>
  );
};

export const useMainContext = (): MainContextResult => useContext<MainContextResult>(MainContext);
export default MainContextProvider;
