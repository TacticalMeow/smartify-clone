import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box, TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Divider,
} from '@mui/material';
import { FC, useEffect } from 'react';
import { FormValues } from '../types';
import { defaultFormValues } from '../consts';

type Props = {
  setFormValues: (formValue:FormValues) => void;
  generateButtonIsDisabled: boolean;
}
const InputForm : FC<Props> = ({
  setFormValues,
  generateButtonIsDisabled,
}) => {
  const {
    control,
    watch,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<FormValues>({
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    setFormValues(defaultFormValues);
  }, []);

  useEffect(() => {
    const subscription = watch((value) => setFormValues(value as FormValues));
    return () => subscription.unsubscribe();
  }, [isDirty, dirtyFields]);

  return (
    <Box
      sx={{
        bottom: '15%',
        display: 'flex',
        width: '85%',
        height: '80%',
        gap: '10px',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
      }}
      component="form"
    >
      <Typography variant="subtitle1"> First choose from where you want to take songs and tracks: </Typography>
      <Controller
        name="radioGroupOption"
        control={control}
        render={({ field }) => (
          <RadioGroup {...field}>
            <FormControlLabel value="all" control={<Radio />} label="All music libraries" />
            <FormControlLabel value="mine" control={<Radio />} label="My personal music library" />
          </RadioGroup>
        )}
      />
      <Divider sx={{ width: '60%' }} />
      <Typography variant="subtitle1"> Now give a name to your new playlist: </Typography>
      <Controller
        name="playlistName"
        control={control}
        render={({ field }) => (
          <TextField id="outlined-basic" label="Playlist Name" variant="outlined" {...field} />
        )}
      />
      {
        (errors.playlistName?.message)
        && (
        <h1>
          error occured
        </h1>
        )
      }
      <Typography
        variant="subtitle1"
        sx={{
          position: 'relative',
          left: '25%',
          opacity: generateButtonIsDisabled ? '0' : '1',
          transition: 'opacity 0.3s',
        }}
      >
        {' '}
        All Done! Press Generate when your&apos;e ready.
        {' '}

      </Typography>
    </Box>
  );
};

export default InputForm;
