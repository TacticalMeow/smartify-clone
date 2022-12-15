/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
import {
  SvgIconProps, Theme, Typography,
} from '@mui/material';
import React from 'react';
import { Box, styled } from '@mui/system';
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';

declare module 'react' {
    interface CSSProperties {
      '--tree-view-color'?: string;
      '--tree-view-bg-color'?: string;
    }
  }

  type StyledTreeItemProps = TreeItemProps & {
    bgColor?: string;
    color?: string;
    labelIcon?: React.ElementType<SvgIconProps>;
    labelInfo?: string;
    labelText: string;
  };

const StyledTreeItemRoot = styled(TreeItem)(({ theme }: {theme: Theme}) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    fontSize: 30,
    color: theme.palette.primary.light,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '&.Mui-expanded': {
      fontWeight: theme.typography.fontWeightRegular,
    },
    '&:hover': {
      color: 'white',
      backgroundColor: 'rgba(19, 47, 76, 0.4)',
    },
    '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
      backgroundColor: `var(--tree-view-bg-color, ${'rgba(51, 153, 255, 0.24)'})`,
      color: 'var(--tree-view-color, rgb(102, 178, 255))',
      fontWeight: 500,
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: 'inherit',
      color: 'inherit',
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      color: theme.palette.text.secondary,
      paddingLeft: theme.spacing(2),
    },
  },
}));

const StyledTreeItem = (props: StyledTreeItemProps) => {
  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    ...other
  } = props;

  return (
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
    <StyledTreeItemRoot
      label={(
        <Box sx={{
          display: 'flex', alignItems: 'center', p: 0.5, pr: 0,
        }}
        >
          {LabelIcon && <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />}
          <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </Box>
        )}
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor,
      }}
      {...other}
    />
  );
};

export default StyledTreeItem;
