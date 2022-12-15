import {
  Box, FormControl, InputLabel, MenuItem, Select, Typography,
} from '@mui/material';
import _ from 'lodash';
import React, { FC } from 'react';
import { Controller } from 'react-hook-form';
import { ProcessorParamComponentProps, SelectParamProps } from 'screens/Jobs/EditProcessor/Params/types';

const SelectParam: FC<ProcessorParamComponentProps<SelectParamProps>> = ({
  name, label, required, description, defaultValue,
  control, validate, props, type, ComponentProps,
}) => {
  const {
    items, multiple, resolveLabel, resolveValue,
  } = props as SelectParamProps;

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
            <InputLabel id={label}>{ _.startCase(label) }</InputLabel>
            <Select
              labelId={label}
              required={required}
              onChange={onChange}
              value={value || ['']}
              label={_.startCase(label)}
              multiple={multiple || false}
              {...ComponentProps}
              type={type || 'text'}
              MenuProps={{ sx: { maxHeight: 200 } }}
            >
              { items.map((item: string) => (
                <MenuItem
                  key={item}
                  value={resolveValue ? resolveValue(item) : item}
                >
                  { resolveLabel ? resolveLabel(item) : item }

                </MenuItem>
              )) }
            </Select>
          </FormControl>
        )}
      />
      <Typography variant="caption" sx={{ marginTop: 1, marginLeft: 1 }}>{ description }</Typography>
    </Box>
  );
};

export default SelectParam;
