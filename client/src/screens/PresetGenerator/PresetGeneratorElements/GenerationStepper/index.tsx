import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';

type StepperProps = {
    steps: string[];
    children?: React.ReactNode[];
    isDisabled: boolean
    finishOnClick: ()=>void;
}
const HorizontalLinearStepper = ({
  steps, children, isDisabled, finishOnClick,
} : StepperProps) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const isStepSkipped = (step: number) => skipped.has(step);

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{
      width: '85%',
      height: '550px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '20px',
    }}
    >
      <Stepper
        activeStep={activeStep}
        sx={{
          width: '95%',
          display: 'flex',
          justifyContent: 'space-around',
          flexDirection: 'row',
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {children ? children[activeStep] : undefined}
      <Box sx={(theme) => ({
        [theme.breakpoints.up('sm')]: {
          width: '80%',
        },
        [theme.breakpoints.down('sm')]: {
          width: '90%',
        },
        display: 'flex',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
      })}
      >
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
          variant="contained"
        >
          Previous Step
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        {activeStep !== steps.length - 1
          ? (
            <Button onClick={handleNext} variant="contained">
              Next Step
            </Button>
          )
          : (
            <Button onClick={finishOnClick} disabled={isDisabled} variant="contained">
              Generate!
            </Button>
          )}
      </Box>
    </Box>
  );
};

export default HorizontalLinearStepper;
