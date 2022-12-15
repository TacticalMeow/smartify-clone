import { ProcessorResult, Sample as SampleType } from '@smarter/shared';
import _ from 'lodash';
import { Processor } from 'logic/core/processor';
import { JobResources } from 'logic/core/types';
import { ProcessorError } from 'logic/processors/processorError';

export class SampleProcessor extends Processor<SampleType> {
  async process(
    jobResources: JobResources,
    data: ProcessorResult[] = [],
  ): Promise<ProcessorResult[]> {
    const { count } = this.config.params;

    try {
      return _.sampleSize(data, count);
    } catch (err) {
      throw new ProcessorError(`unexpected error. ${err}`, this.config, err);
    }
  }
}
