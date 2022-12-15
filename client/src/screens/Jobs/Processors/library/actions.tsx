import {
  Sample, ProcessorTypes, Actions, FilterByAudioFeatures, NoLongerThan,
  NoShorterThan, GenerateMoreTracksLike, LanguageFilter,
} from '@smarter/shared';
import { ProcessorById, Processor, ProcessorParamTypes } from 'screens/Jobs/Processors/library/types';
import React from 'react';
import { languages } from './languages';

const SampleAction: Processor<Sample> = {
  processorId: Actions.Sample,
  processorTypeDisplayName: 'Sample',
  displayNameTemplate: 'Sample {count}',
  description: (
    <>
      This processor will randomly sample up to
      {' '}
      <i>count</i>
      {' '}
      tracks from the input stream.
      Sampled tracks may be returned in any order
    </>
  ),
  processorType: ProcessorTypes.Action,
  paramsConfig: [
    {
      name: 'count',
      required: true,
      type: ProcessorParamTypes.Number,
    },
  ],
  params: {
    count: 0,
  },
};

const FilterByAudioFeaturesAction: Processor<FilterByAudioFeatures> = {
  processorId: Actions.FilterByAudioFeatures,
  displayName: 'Filter By Audio Features',
  processorTypeDisplayName: 'Filter By Audio Features',
  description: 'This processor will filter the tracks by the given audio features. Available features are: acousticness ,danceability, energy, instrumentalness, liveness, loudness, speechiness, valence, tempo',
  processorType: ProcessorTypes.Action,
  paramsConfig: [
    {
      name: 'acousticness',
      required: false,
      type: ProcessorParamTypes.Slider,
      props: {
        steps: 0.001,
        min: 0.000,
        max: 1.000,
      },
      description: 'A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic.',
    },
    {
      name: 'danceability',
      required: false,
      type: ProcessorParamTypes.Slider,
      props: {
        steps: 0.001,
        min: 0.000,
        max: 1.000,
      },
      description: 'Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable.',
    },
    {
      name: 'energy',
      required: false,
      type: ProcessorParamTypes.Slider,
      props: {
        steps: 0.001,
        min: 0.000,
        max: 1.000,
      },
      description: 'Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.',
    },
    {
      name: 'instrumentalness',
      required: false,
      type: ProcessorParamTypes.Slider,
      props: {
        steps: 0.001,
        min: 0.000,
        max: 1.000,
      },
      description: 'Predicts whether a track contains no vocals. "Ooh" and "aah" sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly "vocal". The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1.0.',
    },
    {
      name: 'liveness',
      required: false,
      type: ProcessorParamTypes.Slider,
      props: {
        steps: 0.001,
        min: 0.000,
        max: 1.000,
      },
      description: 'Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 0.8 provides strong likelihood that the track is live.',
    },
    {
      name: 'loudness',
      required: false,
      type: ProcessorParamTypes.Slider,
      props: {
        steps: 0.001,
        min: -15.000,
        max: 0.000,
      },
      description: 'The overall loudness of a track in decibels (dB). Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks. Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude). Values typically range between -15 and 0 db.',
    },
    {
      name: 'speechiness',
      required: false,
      type: ProcessorParamTypes.Slider,
      props: {
        steps: 0.001,
        min: 0.000,
        max: 1.000,
      },
      description: 'Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 0.33 most likely represent music and other non-speech-like tracks.',
    },
    {
      name: 'valence',
      required: false,
      type: ProcessorParamTypes.Slider,
      props: {
        steps: 0.001,
        min: 0.000,
        max: 1.000,
      },
      description: 'A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).',
    },
    {
      name: 'tempo',
      required: false,
      type: ProcessorParamTypes.Slider,
      props: {
        steps: 0.01,
        min: 60.00,
        max: 150.00,
      },
      description: 'The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration.',
    },
  ],
  params: {
    acousticness: [0.000, 1.000],
    danceability: [0.000, 1.000],
    energy: [0.000, 1.000],
    instrumentalness: [0.000, 1.000],
    liveness: [0.000, 1.000],
    loudness: [-15.000, 0.000],
    speechiness: [0.000, 1.000],
    valence: [0.000, 1.000],
    tempo: [60.00, 150.00],
  },
};

const DedupAction: Processor<Record<string, never>> = {
  processorId: Actions.Dedup,
  processorTypeDisplayName: 'Remove Duplicates',
  description: (
    <>
      This processor will remove all extra copies of songs from input stream
    </>
  ),
  processorType: ProcessorTypes.Action,
  paramsConfig: [
  ],
  params: {
  },
};

const SeparateArtistsAction: Processor<Record<string, never>> = {
  processorId: Actions.SeparateArtists,
  processorTypeDisplayName: 'Separate Artists',
  description: (
    'This processor will shuffle the playlist so that there will not be \n songs by the same artist next to each other.'
  ),
  processorType: ProcessorTypes.Action,
  paramsConfig: [
  ],
  params: {
  },
};

const NoLongerThanAction: Processor<NoLongerThan> = {
  processorId: Actions.NoLongerThan,
  processorTypeDisplayName: 'No Longer Than',
  displayNameTemplate: 'No Longer Than {limit}',
  description: (
    'This processor will limit input stream to only songs whos length is below time given'
  ),
  processorType: ProcessorTypes.Action,
  paramsConfig: [
    {
      name: 'limit',
      required: false,
      type: ProcessorParamTypes.TimePicker,
      props: {
      },
      description: 'Set the maximum time',
    },
  ],
  params: {
    limit: '00:00',
  },
};

const NoShorterThanAction: Processor<NoShorterThan> = {
  processorId: Actions.NoShorterThan,
  processorTypeDisplayName: 'No Shorter Than',
  displayNameTemplate: 'No Shorter Than {limit}',
  description: (
    'This processor will limit input stream to only songs whos length is above time given'
  ),
  processorType: ProcessorTypes.Action,
  paramsConfig: [
    {
      name: 'limit',
      required: false,
      type: ProcessorParamTypes.TimePicker,
      props: {
      },
      description: 'Set the maximum time',
    },
  ],
  params: {
    limit: '00:00',
  },
};

const GenerateMoreTracksLikeAction: Processor<GenerateMoreTracksLike> = {
  processorId: Actions.GenerateMoreTracksLike,
  processorTypeDisplayName: 'Generate More Tracks Like',
  displayNameTemplate: 'Generate {limit} Tracks Like',
  description: 'This processor will generate more tracks based on the existing stream',
  processorType: ProcessorTypes.Action,
  paramsConfig: [
    {
      name: 'limit',
      required: true,
      type: ProcessorParamTypes.Number,
      rules: {
        min: {
          value: 10,
          message: 'value must be larger than 10',
        },
        max: {
          value: 100,
          message: 'value must be lower than 100',
        },
      },

    },
  ],
  params: {
    limit: 10,
  },
};

const FilterByLanguage: Processor<LanguageFilter> = {
  processorId: Actions.FilterByLanguage,
  displayName: 'Filter by Language',
  processorTypeDisplayName: 'Filter by Language',
  description: (
    'This processor will only keep songs of the selected languages.'
  ),
  processorType: ProcessorTypes.Action,
  paramsConfig: [
    {
      name: 'languages',
      required: false,
      type: ProcessorParamTypes.Select,
      props: {
        items:
        [
          ...languages,
        ],
        multiple: true,
      },
      description: 'Select Languages',
    },
  ],
  params: {
    languages: ['English'],
  },
};

export const ActionProcessors: ProcessorById<Actions> = {
  [Actions.FilterByLanguage]: FilterByLanguage,
  [Actions.Sample]: SampleAction,
  [Actions.FilterByAudioFeatures]: FilterByAudioFeaturesAction,
  [Actions.Dedup]: DedupAction,
  [Actions.SeparateArtists]: SeparateArtistsAction,
  [Actions.NoLongerThan]: NoLongerThanAction,
  [Actions.NoShorterThan]: NoShorterThanAction,
  [Actions.GenerateMoreTracksLike]: GenerateMoreTracksLikeAction,
};
