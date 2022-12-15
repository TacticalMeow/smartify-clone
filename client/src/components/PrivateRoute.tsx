import { useAuthContext } from 'contexts/AuthContext';
import React, { FC } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoute: FC = () => {
  const { isAuthenticated } = useAuthContext();

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
