import { FilterByAudioFeatures, SpotifyAudioFeatures } from '@smarter/shared';
import { ChipData, FormValues, Moods } from './types';

const MoodChips: ChipData[] = [
  { key: 0, label: Moods.Happy },
  { key: 1, label: Moods.Sad },
  { key: 2, label: Moods.Dance },
  { key: 3, label: Moods.Acoustic },
  { key: 4, label: Moods.Chill },
  { key: 5, label: Moods.Instrumental },
  { key: 6, label: Moods.Workout },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MoodToAudiofeatures:{[mood in Moods] : {[key in SpotifyAudioFeatures]? : number[]}} = {
  [Moods.Happy]: {
    energy: [0.35, 0.85],
    danceability: [0.5, 1.00],
    instrumentalness: [0, 0.5],
    valence: [0.6, 1.0],

  },
  [Moods.Sad]: {
    energy: [0.00, 0.4],
    danceability: [0.0, 0.4],
    valence: [0, 0.45],
    tempo: [60, 180],
  },

  [Moods.Dance]: {
    speechiness: [0.00, 0.7],
    energy: [0.3, 1.0],
    danceability: [0.7, 1.0],
    tempo: [90, 150],
    liveness: [0, 0.7],
    acousticness: [0, 0.7],
  },
  [Moods.Acoustic]: {
    acousticness: [0.7, 1.0],
  },
  [Moods.Chill]: {
    energy: [0.0, 0.4],
    valence: [0.3, 1.0],
    tempo: [60, 120],
    danceability: [0.0, 0.6],
  },
  [Moods.Workout]: {
    energy: [0.65, 1.0],
    acousticness: [0.0, 0.6],
    danceability: [0.5, 1.0],
    speechiness: [0.3, 0.7],
    valence: [0.35, 1.0],
  },
  [Moods.Instrumental]: {
    instrumentalness: [0.7, 1.0],
    speechiness: [0, 0.7],
  },
};

const defaultAudioFeatures = ():FilterByAudioFeatures => ({
  acousticness: [0.000, 1.000],
  danceability: [0.000, 1.000],
  energy: [0.000, 1.000],
  instrumentalness: [0.000, 1.000],
  liveness: [0.000, 1.000],
  loudness: [-15.000, 0.000],
  speechiness: [0.000, 1.000],
  valence: [0.000, 1.000],
  tempo: [60.00, 150.00],
});

const defaultFormValues: FormValues = {
  playlistName: '',
  radioGroupOption: 'all',
};

export {
  MoodChips, defaultAudioFeatures, MoodToAudiofeatures, defaultFormValues,
};
