import {
  Box, FormControl, IconButton, TextField, Tooltip, Typography,
} from '@mui/material';
import _ from 'lodash';
import React, { FC } from 'react';
import { Controller } from 'react-hook-form';
import { ProcessorParamComponentProps } from 'screens/Jobs/EditProcessor/Params/types';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

const TimePickerParam: FC<ProcessorParamComponentProps> = ({
  name, label, required, description, defaultValue,
  control, validate,
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <Controller
      name={name}
      defaultValue={defaultValue}
      control={control}
      rules={{ required, validate }}
      render={({ field: { onChange, value } }) => (
        <FormControl>
          <Box paddingY={2} display="flex" alignItems="center">
            <Typography>{ _.startCase(label) }</Typography>
            {description && (
            <Box marginX={1}>
              <Tooltip
                PopperProps={{
                  sx: { backgroundColor: '#0a1929ad' },
                } as any}
                title={<Typography variant="body1">{description}</Typography>}
              >
                <IconButton>
                  <QuestionMarkIcon sx={{ fontSize: '16px' }} />
                </IconButton>
              </Tooltip>
            </Box>
            )}
          </Box>
          <Box>
            <TimePicker
              ampm={false}
              views={['minutes', 'seconds']}
              inputFormat="mm:ss"
              label="Minutes and seconds"
              value={value}
              onChange={onChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Box>
        </FormControl>
      )}
    />
  </Box>
);

export default TimePickerParam;
