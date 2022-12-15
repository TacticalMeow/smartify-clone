import { ProcessorResult } from '@smarter/shared';
import { logger } from 'logger';
import { Processor } from 'logic/core/processor';
import { JobResources } from 'logic/core/types';
import { ProcessorError } from 'logic/processors/processorError';
import { serializeTrack } from 'logic/processors/sources/utils/serializeTrack';
import { getAllItems } from 'logic/processors/utils/getAllItems';

export class GetMySavedTracksProcessor extends Processor<Record<string, never>> {
  async process(
    jobResources: JobResources,
    data: ProcessorResult[] = [],
  ): Promise<ProcessorResult[]> {
    const { spotifyClient } = jobResources;

    let tracks = [];
    const limit = 50;

    try {
      const response = await spotifyClient?.getMySavedTracks({ limit });

      if (response) {
        const { body: mySavedTracksFirstPage } = response;

        const mySavedTracks = await getAllItems(
          mySavedTracksFirstPage,
          (args) => spotifyClient?.getMySavedTracks(args),
          limit,
        );

        tracks = mySavedTracks.map((item) => serializeTrack(
          item.track,
          item.track.album.release_date,
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
