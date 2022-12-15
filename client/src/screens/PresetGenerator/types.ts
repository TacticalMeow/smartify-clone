import { ProcessorIds, ProcessorTypes } from '@smarter/shared';

export type ChipData = {
    key:number;
    label: string;
}

export type MoodChipsProps = {
    unpickedChipData: ChipData[];
    setUnpickedChipData: React.Dispatch<React.SetStateAction<ChipData[]>>;
    pickedChipData: ChipData[];
    setPickedChipData: React.Dispatch<React.SetStateAction<ChipData[]>>;
}

export type UserGeneratedData = {
    displayName: string,
    processorId: ProcessorIds,
    processorType: ProcessorTypes,
    params: Record<string, any>,
}

export type spotifySourceOptions = 'mine' | 'all';

export type FormValues = {
    playlistName: string;
    radioGroupOption: spotifySourceOptions;
}

export enum GenerationDialogState {
    Idle,
    Loading,
    Error,
    Done,
}

export const enum Moods {
    Happy = 'Happy',
    Sad = 'Sad',
    Dance = 'Dance',
    Chill = 'Chill',
    Acoustic = 'Acoustic',
    Instrumental = 'Instrumental',
    Workout = 'Workout',
  }
