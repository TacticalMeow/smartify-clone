import {
  Chip, ChipProps,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { FC } from 'react';

interface Props extends ChipProps {
  customSize:number
}

const useStyles = makeStyles<Props>((props) => ({
  root: {
    fontSize: () => `${props.customSize * 0.8125}rem`,
    height: () => `${props.customSize * 32}px`,
    borderRadius: '9999px',
  },
  deleteIcon: {
    height: () => `${props.customSize * 22}px`,
    width: () => `${props.customSize * 22}px`,
    color: 'green',
  },
}));

const CustomChip: FC<Props> = (props) => {
  const { customSize = 1, ...restProps } = props;
  const classes = useStyles({ customSize });

  return (
    <Chip
      {...restProps}
      className={classes.root}
      classes={{ deleteIcon: classes.deleteIcon }}
    />
  );
};

export default CustomChip;
