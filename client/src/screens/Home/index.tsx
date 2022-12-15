import {
  Box,
} from '@mui/material';
import React, { FC } from 'react';
import HeroSection from './HeroSection';
import PresetWizard from './PresetWizardSection';
import SandBoxInfo from './SandboxSection';

const Home: FC = () => (
  <Box
    sx={{ display: 'flex', flexDirection: 'column', backgroundColor: '#121417' }}
  >
    <HeroSection />
    <PresetWizard />
    <SandBoxInfo />
  </Box>
);
export default Home;
