import {
  Box, Button,
  Dialog, Typography, Paper, Divider, DialogTitle,
  DialogContent, InputBase,
  List, ListItem, ListItemText, ListItemButton, IconButton,
} from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { ProcessorsLibraryByType } from 'screens/Jobs/Processors/library';
import _ from 'lodash';
import { CreateNodeParams } from 'screens/Jobs/types';
import { Processor } from 'screens/Jobs/Processors/library/types';
import { useKeyPress } from 'react-flow-renderer';
import SearchIcon from '@mui/icons-material/Search';
import { useAutocomplete } from '@mui/lab';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type Props = {
    open: boolean;
    onClose: () => void;
    onCreate: (params: CreateNodeParams) => void;
}

const AddProcessorDialog: FC<Props> = ({ open, onClose, onCreate }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [pointerIndex, setPointerIndex] = useState<number>(-1);
  const enterPressed = useKeyPress('Enter');

  const options = _.flatten(Object.keys(ProcessorsLibraryByType).map((processorType) => (
    ProcessorsLibraryByType as any)[processorType].map(
    (processor: Processor<any>) => ({
      name: processor.processorTypeDisplayName,
      type: _.capitalize(processorType),
      processor,
    }),
  ))).map((a, index) => ({ ...a, index }));

  const {
    groupedOptions, getInputProps, focused,
  } = useAutocomplete({
    id: 'search-processor',
    options,
    getOptionLabel: (option) => option.name,
    openOnFocus: true,
  });

  const items = _.isEmpty(groupedOptions)
    ? options
    : groupedOptions.map((a, i) => ({ ...a, dummyIndex: i }));

  useEffect(() => {
    if (focused
      && (_.isEmpty(groupedOptions) || groupedOptions.length === options.length)
      && pointerIndex !== -1) {
      setSelectedIndex(-1);
      setPointerIndex(-1);
    }

    if (
      focused && !_.isEmpty(groupedOptions)
       && groupedOptions.length !== options.length
       && (pointerIndex === -1 || pointerIndex === 0)) {
      setPointerIndex(0);
    }
  }, [focused, selectedIndex, groupedOptions, pointerIndex]);

  const handleClose = () => {
    onClose();
    setSelectedIndex(-1);
    setPointerIndex(-1);
  };

  const onSubmit = () => {
    if (selectedIndex !== -1) {
      const selectedProcessor = options[selectedIndex].processor;

      const {
        processorId, processorType, params, displayName,
      } = selectedProcessor;
      onCreate({
        processorId,
        processorType,
        params,
        displayName,
      });
      handleClose();
    }
  };

  const onKeyPressSearch = (key: string) => {
    if (key === 'ArrowUp' && pointerIndex > 0) {
      setPointerIndex((prevIndex) => prevIndex - 1);
    } else if (key === 'ArrowDown'
    && pointerIndex !== options.length - 1
    && groupedOptions.length !== options.length
    ) {
      setPointerIndex((prevIndex) => prevIndex + 1);
    }

    if (key === 'Enter') {
      if (!_.isEmpty(groupedOptions)
        && pointerIndex !== -1
        && selectedIndex === -1
      ) {
        const { index } = groupedOptions[pointerIndex];
        setSelectedIndex(index);
      } else {
        onSubmit();
      }
    }
  };

  useEffect(() => {
    if (enterPressed && selectedIndex !== -1) {
      onSubmit();
    }
  }, [enterPressed, selectedIndex]);

  return (
    <Dialog
      onMouseDown={(event) => event.preventDefault()}
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: (theme) => ({
          backgroundColor: theme.palette.background.paper,
        }),
      }}
    >
      <Box
        sx={{
          height: '55vh',
        }}
      >
        <Box>
          <DialogTitle sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
          >
            <SearchIcon sx={{ mx: 1 }} color="primary" />
            <InputBase
              sx={{ width: '100%' }}
              placeholder="Search..."
              {...getInputProps() as any}
              onKeyDown={(event) => onKeyPressSearch(event.key)}
              autoFocus
            />
          </DialogTitle>
          <DialogContent sx={{ paddingX: 5, paddingY: 3, borderBottom: 'none' }} dividers>
            {selectedIndex !== -1
              ? (
                <Box height="100%">
                  <Box display="flex" width="100%" justifyContent="space-between" mb={2}>
                    <Typography variant="h4">{options[selectedIndex].processor.processorTypeDisplayName}</Typography>
                    <Box display="flex">
                      <IconButton
                        color="primary"
                        sx={{ mx: 1 }}
                        onClick={() => {
                          setSelectedIndex(-1);
                          setPointerIndex(-1);
                        }}
                      >
                        <ArrowBackIcon />
                      </IconButton>
                      <Button type="submit" variant="outlined" onClick={onSubmit}>
                        Add
                      </Button>
                    </Box>
                  </Box>
                  <Typography variant="body1">{options[selectedIndex].processor.description}</Typography>
                  {options[selectedIndex].processor.paramsConfig.length > 0
                  && (
                  <div>
                    <Box mt={5} mb={2}>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>Parameters:</Typography>
                    </Box>
                    <Paper sx={(theme) => ({
                      boxShadow: 'none',
                      padding: 3,
                      border: '1px solid rgba(194, 224, 255, 0.08)',
                      backgroundColor: theme.palette.background.default,
                    })}
                    >
                      {options[selectedIndex].processor.paramsConfig.map((param:any, i: number) => (
                        <Box key={param.name} mb={1}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{param.name}</Typography>
                          <Typography variant="subtitle2">{param.description}</Typography>
                          {i < options[selectedIndex].processor.paramsConfig.length - 1 && (
                          <Divider sx={{ mt: 1 }} />)}
                        </Box>
                      ))}
                    </Paper>
                  </div>
                  )}
                </Box>
              )
              : (
                <Box>
                  <Typography variant="h4">Processors</Typography>
                  <Box display="flex" flexDirection="column" marginY={2}>
                    {
                      Object.entries(_.groupBy<typeof groupedOptions>(items, 'type')).map(([processorType, processors]) => (
                        <Box width="100%">
                          <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 500 }} gutterBottom>{`${_.capitalize(processorType)}s`}</Typography>
                          <List>
                            {processors.map(
                              (option) => (
                                <ListItem key={option.index} disablePadding disableGutters>
                                  <ListItemButton
                                    selected={option.dummyIndex === pointerIndex}
                                    onClick={() => setSelectedIndex(option.index)}
                                    sx={{
                                      marginBottom: 1,
                                      borderRadius: '4px',
                                      backgroundColor: 'transparent',
                                      borderWidth: '1px',
                                      borderStyle: 'solid',
                                      borderColor: 'transparent transparent rgb(19, 47, 76)',
                                      borderImage: 'initial',
                                      display: 'flex',
                                      justifyContent: 'center',
                                      flexDirection: 'column',
                                      alignItems: 'flex-start',

                                      '&:hover': {
                                        color: 'rgb(153, 204, 243)',
                                        borderColor: 'rgb(38, 93, 151)',
                                        borderRadius: '10px',

                                        '& *': {
                                          color: 'rgb(153, 204, 243)',
                                        },
                                      },

                                      '& .MuiListItemText-root': {
                                        color: 'white',
                                      },

                                      '&.Mui-selected': {
                                        color: 'rgb(153, 204, 243)',
                                        borderColor: 'rgb(38, 93, 151)',
                                        borderRadius: '10px',
                                      },
                                    }}
                                  >
                                    <ListItemText>
                                      {option.name}
                                    </ListItemText>
                                    <Typography variant="subtitle2">{option.processor.description}</Typography>
                                  </ListItemButton>
                                </ListItem>
                              ),
                            )}
                          </List>
                        </Box>
                      ))
                    }
                  </Box>
                </Box>
              )}
          </DialogContent>
        </Box>
      </Box>
    </Dialog>
  );
};

export default AddProcessorDialog;
