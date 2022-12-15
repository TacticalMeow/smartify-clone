import {
  Box, Typography, TableContainer, Table, Paper,
  TableHead, TableRow, TableCell, TableBody, IconButton,
} from '@mui/material';
import { JobProcessorsHistory, TestJobResult } from '@smarter/shared';
import _ from 'lodash';
import React, {
  FC,
  useEffect, useState,
} from 'react';
import ViewIcon from '@mui/icons-material/Visibility';
import { useReactFlow } from 'react-flow-renderer';

type Props = {
    jobResults: TestJobResult,
    setShouldFadeDialog: (fade: boolean) => void,
}

export type ResultTableRow = {
    id: string,
    name: string,
    artists: string,
    length: string,
    releaseDate: string,
    processorsHistory: JobProcessorsHistory[],
}

const Error = () => (
  <Box display="flex" justifyContent="center" alignItems="center" paddingTop={10}>
    <Typography variant="h6">
      Something went wrong please try again later
    </Typography>
  </Box>
);

const Results: FC<Props> = ({ jobResults, setShouldFadeDialog }) => {
  const [rows, setRows] = useState<ResultTableRow[]>([]);

  const {
    setEdges, setNodes, fitView,
  } = useReactFlow();

  useEffect(() => {
    if (jobResults) {
      const flatResults = _.flatten(jobResults.results);
      const tempRows: ResultTableRow[] = flatResults.map((row) => {
        const artists: string = row.artists.join(',');
        const date = new Date(row.length);
        const min = date.getMinutes();
        const sec = date.getSeconds();

        return {
          id: row.id,
          name: row.name,
          artists,
          length: `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`,
          releaseDate: row.releaseDate,
          processorsHistory: row.processorsHistory,
        };
      });

      setRows(tempRows);
    }
  }, [jobResults, setRows]);

  const handleViewTrackJourney = (row: ResultTableRow) => {
    fitView();
    setShouldFadeDialog(true);
    const nodeIds = row.processorsHistory.map((h) => h.nodeId);

    setNodes((prevNodes) => prevNodes.map((node) => {
      if (nodeIds.includes(node.id)) {
        return {
          ...node,
          selected: true,
        };
      }

      return node;
    }));

    setEdges((prevEdges) => prevEdges.map((edge) => {
      if (nodeIds.includes(edge.source) && nodeIds.includes(edge.target)) {
        return {
          ...edge,
          selected: true,
          animated: true,
        };
      }

      return edge;
    }));
  };

  const shouldShowError = (jobResults?.errors && jobResults?.errors.length > 0)
   || _.flatten(jobResults.results || []).length === 0;

  return (
    <div>
      {shouldShowError ? <Error /> : (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          flexDirection: 'column',
          paddingX: 2,
          paddingY: 4,
        }}
        >
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            paddingBottom: 1,
          }}
          >
            <Typography variant="body1">Results:</Typography>
          </Box>
          <TableContainer
            component={Paper}
            sx={(theme) => ({ backgroundColor: theme.palette.background.default })}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Artists</TableCell>
                  <TableCell align="right">Length</TableCell>
                  <TableCell align="right">Release Date</TableCell>
                  <TableCell align="right">Source</TableCell>
                  <TableCell align="right">Target</TableCell>
                  <TableCell align="right">Track Journey</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="center" component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="center">{row.artists}</TableCell>
                    <TableCell align="right">{row.length}</TableCell>
                    <TableCell align="right">{row.releaseDate}</TableCell>
                    <TableCell align="right">{_.first(row.processorsHistory)?.processorName || ''}</TableCell>
                    <TableCell align="right">{_.last(row.processorsHistory)?.processorName || ''}</TableCell>
                    <TableCell align="right">
                      <IconButton onMouseDown={() => handleViewTrackJourney(row)}>
                        <ViewIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </div>
  );
};

export default Results;
