import { GetMyTopTracksSource, ProcessorResult } from '@smarter/shared';
import { logger } from 'logger';
import { Processor } from 'logic/core/processor';
import { JobResources } from 'logic/core/types';
import { ProcessorError } from 'logic/processors/processorError';
import { serializeTrack } from 'logic/processors/sources/utils/serializeTrack';
import { getAllItems } from 'logic/processors/utils/getAllItems';

export class GetMyTopTracksProcessor extends Processor<GetMyTopTracksSource> {
  async process(
    jobResources: JobResources,
    data: ProcessorResult[] = [],
  ): Promise<ProcessorResult[]> {
    const { spotifyClient } = jobResources;
    const { timeRange } = this.config.params;

    let tracks = [];
    const limit = 50;
    try {
      const response = await spotifyClient?.getMyTopTracks({ time_range: timeRange, limit });

      if (response) {
        const { body: myTopTracksFirstPage } = response;

        const mySavedTracks = await getAllItems(
          myTopTracksFirstPage,
          (args) => spotifyClient?.getMySavedAlbums(args),
          limit,
        );

        tracks = mySavedTracks.map((item) => serializeTrack(
          item,
          item.album.release_date,
        ));

        return [...data, ...tracks];
      }

      logger.warn(`failed to generate data from ${this.config.processorId}`);
      return data;
    } catch (err) {
      throw new ProcessorError(`unexpected error. ${err}`, this.config, err);
    }
  }
}
