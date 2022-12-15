import {
  Box, Divider, Fade, ListItem, Typography,
} from '@mui/material';
import React, { FC } from 'react';
import { ChipData, MoodChipsProps } from '../types';
import CustomChip from './CustomChip';

const addChip = (chips: ChipData[], chipToAdd: ChipData) => [...chips, chipToAdd];
const deleteChip = (chips: ChipData[], chipToDelete: ChipData) => chips.filter(
  ((chip) => chip.key !== chipToDelete.key),
);
const MoodPicker: FC<MoodChipsProps> = ({
  unpickedChipData,
  setUnpickedChipData,
  pickedChipData,
  setPickedChipData,
}) => {
  const handleDeleteFromPicked = (chipToDelete: ChipData) => () => {
    setUnpickedChipData((chips) => addChip(chips, chipToDelete));
    setPickedChipData((chips) => deleteChip(chips, chipToDelete));
  };
  const handlePickFromUnpicked = (chipToPick: ChipData) => () => {
    setUnpickedChipData((chips) => deleteChip(chips, chipToPick));
    setPickedChipData((chips) => addChip(chips, chipToPick));
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      width: '55%',
      height: '80%',
    }}
    >
      <Typography variant="subtitle1" sx={{ textAlign: 'center' }}> Pick moods for your liking from below: </Typography>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        flexwrap: 'wrap',
        width: '100%',
        height: '45%',
        alignContent: 'flex-start',
      }}
      >
        {unpickedChipData.map((chip) => (
          <Fade in timeout={300}>
            <ListItem key={chip.key}>
              <CustomChip
                customSize={1}
                label={chip.label}
                onClick={handlePickFromUnpicked(chip)}
              />
            </ListItem>
          </Fade>
        ))}
      </Box>
      <Divider variant="middle" sx={{ color: '#f5f5f5' }} />
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'flex-start',
        flexwrap: 'wrap',
        width: '100%',
        height: '45%',
      }}
      >
        {pickedChipData.map((chip) => (
          <Fade in timeout={300}>
            <ListItem key={chip.key}>
              <CustomChip
                customSize={1}
                label={chip.label}
                onDelete={handleDeleteFromPicked(chip)}
              />
            </ListItem>
          </Fade>
        ))}
      </Box>
      <Typography variant="subtitle1" sx={{ textAlign: 'right' }}> Continue to the next step when your done! </Typography>
    </Box>

  );
};

export default MoodPicker;
