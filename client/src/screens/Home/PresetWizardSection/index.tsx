import { FC, useCallback } from 'react';
import * as React from 'react';
import { useAuthContext } from 'contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import InfoPageGenerator from '../InfoPageGenerator';

const PresetWizard :FC = () => {
  const { loginUrl, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const onClick = useCallback(() => {
    // eslint-disable-next-line no-unused-expressions
    !isAuthenticated ? window.location.href = loginUrl : navigate('/presetgen');
  }, [isAuthenticated]);

  return (
    <InfoPageGenerator
      id="preset"
      title="Preset Generator"
      description="Customize a playlist for your needs with just a few clicks!"
      img="/Images/presetwizard_info_image.jpg"
      buttonLabel="Try It Now"
      onClick={onClick}
    />
  );
};

export default PresetWizard;
