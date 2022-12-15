import { ProcessorResult, NoLongerThan } from '@smarter/shared';
import { logger } from 'logger';
import { Processor } from 'logic/core/processor';
import { JobResources } from 'logic/core/types';
import { ProcessorError } from 'logic/processors/processorError';
import moment from 'moment';

export class NoLongerThanProcessor extends Processor<NoLongerThan> {
  async process(
    jobResources: JobResources,
    data: ProcessorResult[] = [],
  ): Promise<ProcessorResult[]> {
    try {
      if (this.config.params.limit) {
        const normalizedTime = moment(this.config.params.limit).format('HH:mm:ss');
        return data.filter(
          (track) => (track.length / 1000) <= moment.duration(normalizedTime).asSeconds(),
        );
      }
      throw new Error('no limit found');
    } catch (err) {
      throw new ProcessorError(`unexpected error. ${err}`, this.config, err);
    }
  }
}
