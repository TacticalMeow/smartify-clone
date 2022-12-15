import React, {
  createContext, useContext, FC, useMemo, useState, useEffect,
} from 'react';
import _ from 'lodash';
import { smartifyClient, spotifyBasicClient } from 'apiClients';
import { Endpoints, UserConfig } from '@smarter/shared';
import { AxiosError } from 'axios';
import { authEndpoint, clientId, redirectUri } from 'consts';

type AuthContextResult = {
    loginUrl: string;
    getToken: (code: string) => void
    isAuthenticated: boolean;
    isAuthLoading: boolean;
    refreshAccessToken: () => void,
    logout: () => void,
    userConfig: UserConfig
}

const scopes = [
  'user-read-recently-played',
  'playlist-modify-private',
  'playlist-modify-public',
  'user-follow-read',
  'user-library-read',
  'user-top-read',
];

const loginUrl = `${authEndpoint}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes.join(
  '%20',
)}`;

const DEFAULT_USER_CONFIG: UserConfig = {
  maximumJobs: 5,
  maximumProcessorPerJob: 300,
};

const AuthContext = createContext({
  loginUrl,
  getToken: (code: string) => _.noop(code),
  isAuthenticated: false,
  isAuthLoading: true,
  refreshAccessToken: () => _.noop(),
  logout: () => _.noop(),
  userConfig: DEFAULT_USER_CONFIG,
});

const AuthProvider: FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [userConfig, setUserConfig] = useState<UserConfig>(DEFAULT_USER_CONFIG);

  const authRequestWrapper = async (
    endpoint: string,
    queryParams?: Record<string, unknown>,
  ) :Promise<boolean> => {
    try {
      const response = await smartifyClient.get(
        endpoint,
        {
          ...(queryParams && { params: { ...queryParams } }),
        },
      );

      smartifyClient.defaults.headers.common.Authorization = `Bearer ${response.data.accessToken}`;
      spotifyBasicClient.setAccessToken(response.data.accessToken);

      setIsAuthenticated(true);
      setIsAuthLoading(false);
      setUserConfig(response.data.config);

      return true;
    } catch (err) {
      setIsAuthenticated(false);
      setIsAuthLoading(false);

      return false;
    }
  };

  const refreshAccessToken = async (): Promise<boolean> => authRequestWrapper(
    Endpoints.refreshAccessToken,
  );

  const getToken = async (code: string): Promise<boolean> => authRequestWrapper(
    Endpoints.login,
    { code },
  );

  const logout = async (): Promise<void> => {
    await smartifyClient.get(Endpoints.logout);
    delete smartifyClient.defaults.headers.common.Authorization;

    setIsAuthenticated(false);
    setIsAuthLoading(false);
  };

  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await smartifyClient.get(Endpoints.getCsrf);
      smartifyClient.defaults.headers.post['X-CSRF-Token'] = data.csrfToken;
    };

    getCsrfToken();
  }, []);

  useEffect(() => {
    smartifyClient.interceptors.response.use(undefined, async (error: AxiosError) => {
      if (error.response?.status !== 401) {
        return Promise.reject(error);
      }

      // eslint-disable-next-line no-promise-executor-return
      await new Promise((r) => setTimeout(r, 300));

      const isOk = await refreshAccessToken();

      if (!isOk) {
        return Promise.reject(error);
      }

      const originalRequestConfig = error.config;

      return smartifyClient.request(originalRequestConfig);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={useMemo(() => ({
        loginUrl,
        getToken,
        isAuthenticated,
        isAuthLoading,
        refreshAccessToken,
        logout,
        userConfig,
      }), [isAuthenticated, isAuthLoading, userConfig])}
    >
      { children }
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextResult => useContext<AuthContextResult>(AuthContext);
export default AuthProvider;
