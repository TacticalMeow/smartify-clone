/* eslint-disable class-methods-use-this */
import { BaseProcessorData, JobProcessorsHistory, ProcessorResult } from '@smarter/shared';
import _ from 'lodash';
import { JobResources } from 'logic/core/types';
import { ProcessorError } from 'logic/processors/processorError';

type ProcessorAdditionalConfig = {
  nodeId: string
}

export type ProcessorConfig<T> = BaseProcessorData<T> & ProcessorAdditionalConfig;

export class Processor<T> {
  config: ProcessorConfig<T>;

  // eslint-disable-next-line no-use-before-define
  children: Processor<object>[];

  constructor(config: ProcessorConfig<T>, children: Processor<object>[]) {
    this.config = config;
    this.children = children;
  }

  async process(
    jobResources: JobResources,
    data: ProcessorResult[] = [],
  ): Promise<ProcessorResult[]> {
    throw new Error('not implemented');
  }

  arrange(data: ProcessorResult[] = []): ProcessorResult[] {
    return data.map((d) => ({
      ...d,
      processorsHistory: [
        ...d.processorsHistory,
        {
          nodeId: this.config.nodeId,
          processorId: this.config.processorId,
          processorName: this.config.displayName,
        } as JobProcessorsHistory,
      ],
    }));
  }

  public async run(jobResources: JobResources): Promise<ProcessorResult[]> {
    if (this.children.length > 0) {
      const output = _.flatten(await Promise.all(this.children.map(async (child) => {
        const data = await child.run(jobResources);

        return data;
      })));

      let processed: ProcessorResult[] = [];
      try {
        processed = await this.process(jobResources, output);
      } catch (err) {
        (err as ProcessorError).log();

        processed = output;
      }

      const arranged = this.arrange(processed);

      return arranged;
    }

    let processed: ProcessorResult[] = [];
    try {
      processed = await this.process(jobResources);
    } catch (err) {
      (err as ProcessorError).log();

      processed = [];
    }

    const arranged = this.arrange(processed);

    return arranged;
  }
}
