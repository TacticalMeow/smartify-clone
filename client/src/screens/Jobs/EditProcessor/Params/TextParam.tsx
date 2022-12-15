import { Box, TextField, Typography } from '@mui/material';
import _ from 'lodash';
import React, { FC } from 'react';
import { Controller } from 'react-hook-form';
import { ProcessorParamComponentProps } from 'screens/Jobs/EditProcessor/Params/types';

const TextParam: FC<ProcessorParamComponentProps> = ({
  name, label, required, description, rules,
  defaultValue, control, validate, ComponentProps, type,
}) => (
  <Box sx={{
    display: 'flex',
    flexDirection: 'column',
  }}
  >
    <Controller
      name={name}
      defaultValue={defaultValue}
      control={control}
      rules={{
        required,
        validate,
        ...rules,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          required={required}
          onChange={onChange}
          value={value}
          label={_.startCase(label)}
          error={!!error}
          helperText={error?.message}
          {...ComponentProps}
          type={type || 'text'}
        />
      )}
    />
    <Typography variant="caption" sx={{ marginTop: 1, marginLeft: 1 }}>{description}</Typography>
  </Box>
);

export default TextParam;
