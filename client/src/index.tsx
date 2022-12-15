import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import Layout from 'screens/Layout';
import { theme } from 'theme';
import Home from 'screens/Home';
import { ThemeProvider } from '@mui/material/styles';
import AuthProvider from 'contexts/AuthContext';
import LoginCallback from 'screens/LoginCallback';
import PrivateRoute from 'components/PrivateRoute';
import { CssBaseline } from '@mui/material';
import Jobs from 'screens/Jobs';
import MainContextProvider from 'contexts/MainContext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import PresetGenerator from 'screens/PresetGenerator';

ReactDOM.render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <MainContextProvider>
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/callback" element={<LoginCallback />} />
                  <Route path="/presetgen" element={(<PrivateRoute />)}>
                    <Route path="/presetgen" element={(<PresetGenerator />)} />
                  </Route>
                  <Route path="/jobs" element={<PrivateRoute />}>
                    <Route path="/jobs/" element={<Jobs />} />
                    <Route path="/jobs/:id" element={<Jobs />} />
                  </Route>
                </Routes>
              </Layout>
            </BrowserRouter>
          </MainContextProvider>
        </AuthProvider>
      </ThemeProvider>
    </LocalizationProvider>

  </React.StrictMode>,
  document.getElementById('root'),
);
