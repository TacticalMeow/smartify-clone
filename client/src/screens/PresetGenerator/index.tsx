import { useAuthContext } from 'contexts/AuthContext';
import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PresetGeneratorElements from './PresetGeneratorElements';

const PresetGenerator: FC = () => {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated]);

  return (
    <PresetGeneratorElements />
  );
};

export default PresetGenerator;
