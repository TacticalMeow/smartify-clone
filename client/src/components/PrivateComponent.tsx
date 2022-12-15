import { useAuthContext } from 'contexts/AuthContext';
import React, { FC } from 'react';

const PrivateComponent: FC = ({ children }) => {
  const { isAuthenticated } = useAuthContext();

  return isAuthenticated ? (
    <div>
      {children}
    </div>
  ) : <div />;
};

export default PrivateComponent;
