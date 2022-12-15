import _ from 'lodash';
import { ActionProcessors } from 'screens/Jobs/Processors/library/actions';
import { SourceProcessors } from 'screens/Jobs/Processors/library/sources';
import { TargetProcessors } from 'screens/Jobs/Processors/library/targets';

export const ProcessorsLibrary = {
  ...SourceProcessors,
  ...ActionProcessors,
  ...TargetProcessors,
};

export const ProcessorsLibraryByType = _.groupBy(ProcessorsLibrary, 'processorType');
