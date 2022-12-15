import { Actions } from '@smarter/shared';
import { FilterByAudioFeaturesProcessor } from 'logic/processors/actions/filterByAudioFeatures';
import { SampleProcessor } from 'logic/processors/actions/sample';
import { ProcessorById } from 'logic/processors/types';
import { DedupProcessor } from 'logic/processors/actions/dedup';
import { SeparateArtistsProcessor } from 'logic/processors/actions/separateArtists';
import { GenerateMoreTracksLikeProcessor } from 'logic/processors/actions/generateMoreTracksLike';
import { NoLongerThanProcessor } from './noLongerThan';
import { NoShorterThanProcessor } from './noShorterThan';
import { FilterByLanguageProcessor } from './filterByLanguage';

export const ActionProcessors: ProcessorById<Actions> = {
  [Actions.Sample]: SampleProcessor,
  [Actions.FilterByAudioFeatures]: FilterByAudioFeaturesProcessor,
  [Actions.Dedup]: DedupProcessor,
  [Actions.SeparateArtists]: SeparateArtistsProcessor,
  [Actions.NoLongerThan]: NoLongerThanProcessor,
  [Actions.NoShorterThan]: NoShorterThanProcessor,
  [Actions.GenerateMoreTracksLike]: GenerateMoreTracksLikeProcessor,
  [Actions.FilterByLanguage]: FilterByLanguageProcessor,
};
