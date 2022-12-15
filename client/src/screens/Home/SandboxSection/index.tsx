import { FC, useCallback } from 'react';
import * as React from 'react';
import { useAuthContext } from 'contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import InfoPageGenerator from '../InfoPageGenerator';

const SandBoxInfo :FC = () => {
  const { loginUrl, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const onClick = useCallback(() => {
    // eslint-disable-next-line no-unused-expressions
    !isAuthenticated ? window.location.href = loginUrl : navigate('/jobs');
  }, [isAuthenticated]);

  return (
    <InfoPageGenerator
      id="preset"
      title="Sandbox"
      description="The Sandbox mode is for people who want to fully customize their playlist generation by themselves."
      img="/Images/sandbox_info_image.jpg"
      buttonLabel="Try It Now"
      onClick={onClick}
    />
  );
};

export default SandBoxInfo;
