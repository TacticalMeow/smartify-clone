import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoodChips } from '../consts';
import { ChipData, FormValues, GenerationDialogState } from '../types';
import {
  generateFlow, createJob, saveJob, runJob,
} from '../utils';
import PresetGeneratorBg from './Background';
import GenerateJobDialog from './GenerationDialog';
import HorizontalLinearStepper from './GenerationStepper';
import PresetGenHeadline from './Headline';
import InputForm from './InputForm';
import MoodPicker from './MoodPicker';

const steps = ['Step 1: Mood Picker', 'Step 2: Playlist Options'];

const PresetGeneratorElements:FC = () => {
  const [pickedChipData, setPickedChipData] = React.useState<ChipData[]>([]);
  const [unpickedChipData, setUnpickedChipData] = React.useState<ChipData[]>([...MoodChips]);
  const [generateButtonIsDisabled, setGenerateButtonIsDisabled] = React.useState(true);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = React.useState(false);
  const [generateDialogScreenState,
    setGenerateDialogScreenState] = React.useState(GenerationDialogState.Idle);
  const [formValues, setFormValues] = React.useState({} as FormValues);
  const navigate = useNavigate();

  useEffect(() => {
    if (pickedChipData.length > 0 && formValues.playlistName !== '' && formValues.radioGroupOption) {
      setGenerateButtonIsDisabled(false);
    } else {
      setGenerateButtonIsDisabled(true);
    }
  }, [pickedChipData, formValues]);

  const onSubmit = React.useCallback(async () => {
    setIsGenerateDialogOpen(true);
    setGenerateDialogScreenState(GenerationDialogState.Loading);
    try {
      const flow = await generateFlow(
        pickedChipData,
        formValues.playlistName,
        formValues.radioGroupOption,
      );
      const jobId = await createJob((Date.now() % 1000).toString());
      saveJob(jobId, flow);

      await runJob(jobId, flow);

      setTimeout(() => {
        setGenerateDialogScreenState(GenerationDialogState.Done);
      }, 3000);
    } catch (err: any) {
      setTimeout(() => {
        setGenerateDialogScreenState(GenerationDialogState.Error);
      }, 3000);
    }
  }, [pickedChipData, formValues]);

  return (
    <PresetGeneratorBg>
      <GenerateJobDialog
        open={isGenerateDialogOpen}
        onClose={() => {
          setIsGenerateDialogOpen(false);
          navigate('/');
        }}
        generationDialogScreenState={generateDialogScreenState}
        setGenerationDialogScreenState={setGenerateDialogScreenState}
      />
      <PresetGenHeadline />
      <HorizontalLinearStepper
        steps={steps}
        isDisabled={generateButtonIsDisabled}
        finishOnClick={onSubmit}
      >
        <MoodPicker
          unpickedChipData={unpickedChipData}
          setUnpickedChipData={setUnpickedChipData}
          pickedChipData={pickedChipData}
          setPickedChipData={setPickedChipData}
        />
        <InputForm
          setFormValues={setFormValues}
          generateButtonIsDisabled={generateButtonIsDisabled}
        />
      </HorizontalLinearStepper>

    </PresetGeneratorBg>
  );
};

export default PresetGeneratorElements;
