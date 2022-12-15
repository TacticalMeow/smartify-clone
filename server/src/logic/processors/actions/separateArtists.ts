import { ProcessorResult } from '@smarter/shared';
import _ from 'lodash';
import { Processor } from 'logic/core/processor';
import { JobResources } from 'logic/core/types';
import { ProcessorError } from 'logic/processors/processorError';

const spreadByArtists = (data : ProcessorResult[]) => {
  if (data) {
    const groupedArtistsCollection = _.groupBy(_.shuffle(data), 'artists');
    const spreadedArtistCollection : ProcessorResult[] = [];

    while (spreadedArtistCollection.length < data.length) {
      Object.keys(groupedArtistsCollection).forEach((artist) => {
        const track = groupedArtistsCollection[artist].pop();
        if (track) {
          spreadedArtistCollection.push(track);
        }
      });
    }

    return spreadedArtistCollection;
  }
  return data;
};

export class SeparateArtistsProcessor extends Processor<Record<string, never>> {
  async process(
    jobResources: JobResources,
    data: ProcessorResult[] = [],
  ): Promise<ProcessorResult[]> {
    try {
      return spreadByArtists(data);
    } catch (err) {
      throw new ProcessorError(`unexpected error. ${err}`, this.config, err);
    }
  }
}
