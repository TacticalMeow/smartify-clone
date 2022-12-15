import { LanguageFilter, ProcessorResult } from '@smarter/shared';
import { Processor } from 'logic/core/processor';
import { JobResources } from 'logic/core/types';
import { ProcessorError } from 'logic/processors/processorError';
import { getTracksLanguage } from '../utils/getTrackLanguage';

export class FilterByLanguageProcessor extends Processor<LanguageFilter> {
  async process(
    jobResources: JobResources,
    data: ProcessorResult[] = [],
  ): Promise<ProcessorResult[]> {
    try {
      if (data && this.config.params.languages) {
        const trackLanguages = await getTracksLanguage(data);

        if (trackLanguages) {
          const filteredData = data.filter(
            (track) => (trackLanguages[track.id]
              && this.config.params.languages.includes(trackLanguages[track.id])),
          );
          return filteredData;
        }
      }
      return data;
    } catch (err) {
      throw new ProcessorError(`unexpected error. ${err}`, this.config, err);
    }
  }
}
