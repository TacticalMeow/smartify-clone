import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { FC, memo } from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import { ProcessorsLibrary } from 'screens/Jobs/Processors/library';
import { Processor } from 'screens/Jobs/Processors/library/types';

const SourceProcessor: FC<NodeProps<Processor<any>>> = memo(({ data }) => (
  <>
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
    }}
    >
      <Typography variant="body1">{data.displayName}</Typography>
      {
        data.processorTypeDisplayName !== data.displayName && <Typography variant="caption" color="primary">{ProcessorsLibrary[data.processorId]?.processorTypeDisplayName}</Typography>
      }
    </Box>
    <Handle
      type="source"
      position={Position.Right}
    />
  </>
));

export default SourceProcessor;
