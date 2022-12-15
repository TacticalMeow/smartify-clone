import { ProcessorResult } from '@smarter/shared';
import _ from 'lodash';
import { logger } from 'logger';
import { Processor } from 'logic/core/processor';
import { JobResources } from 'logic/core/types';
import { ProcessorError } from 'logic/processors/processorError';
import { serializeTrack } from 'logic/processors/sources/utils/serializeTrack';
import { getAllItems } from 'logic/processors/utils/getAllItems';

export class GetMySavedAlbumsProcessor extends Processor<Record<string, never>> {
  async process(
    jobResources: JobResources,
    data: ProcessorResult[] = [],
  ): Promise<ProcessorResult[]> {
    const { spotifyClient } = jobResources;

    let tracks = [];
    try {
      const limit = 20;
      const response = await spotifyClient?.getMySavedAlbums({ limit });

      if (response) {
        const { body: mySavedAlbumsFirstPage } = response;

        const mySavedAlbums = await getAllItems(
          mySavedAlbumsFirstPage,
          (args) => spotifyClient?.getMySavedAlbums(args),
          limit,
        );

        tracks = _.flatten(await Promise.all(mySavedAlbums.map(async ({ album }) => {
          const albumTracks = await getAllItems(
            album.tracks,
            (args) => spotifyClient?.getAlbumTracks(album.id, args),
            limit,
          );
          return albumTracks.map((item) => serializeTrack(item, album.release_date));
        })));

        return [...data, ...tracks];
      }

      logger.warn(`failed to generate data from ${this.config.processorId}`);
      return data;
    } catch (err) {
      throw new ProcessorError(`unexpected error. ${err}`, this.config, err);
    }
  }
}
