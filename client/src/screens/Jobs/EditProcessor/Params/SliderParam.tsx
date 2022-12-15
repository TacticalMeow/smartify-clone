import {
  Box, FormControl, IconButton, Slider, Tooltip, Typography, useMediaQuery,
} from '@mui/material';
import _ from 'lodash';
import React, { FC } from 'react';
import { Controller } from 'react-hook-form';
import { ProcessorParamComponentProps, SliderParamProps } from 'screens/Jobs/EditProcessor/Params/types';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { theme } from 'theme';

const SliderParam: FC<ProcessorParamComponentProps<SliderParamProps>> = ({
  name, label, required, description, defaultValue,
  control, validate, props,
}) => {
  const { steps, min, max } = props as SliderParamProps;
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box sx={{
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
            <Box display="flex" alignItems="center">
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
            <Box paddingX={2}>
              <Slider
                value={value}
                min={min}
                step={steps}
                max={max}
                onChange={onChange}
                valueLabelDisplay="auto"
                aria-labelledby="slider"
                marks={(isLargeScreen && props?.marks) ? props.marks : false}
              />
            </Box>
          </FormControl>
        )}
      />
    </Box>
  );
};

export default SliderParam;
