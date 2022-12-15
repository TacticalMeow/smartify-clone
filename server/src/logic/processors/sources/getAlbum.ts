import { GetAlbumSource, ProcessorResult } from '@smarter/shared';
import { Processor } from 'logic/core/processor';
import { JobResources } from 'logic/core/types';
import { ProcessorError } from 'logic/processors/processorError';
import { extractId } from 'logic/processors/sources/utils/extractId';
import { serializeTrack } from 'logic/processors/sources/utils/serializeTrack';
import { getAllItems } from 'logic/processors/utils/getAllItems';

const ALBUM_RESOURCE_NAME = 'album';

export class GetAlbumProcessor extends Processor<GetAlbumSource> {
  async process(
    jobResources: JobResources,
    data: ProcessorResult[] = [],
  ): Promise<ProcessorResult[]> {
    const { spotifyClient } = jobResources;
    const { album: albumAddress } = this.config.params;

    const albumId = extractId(albumAddress, ALBUM_RESOURCE_NAME);

    let tracks = [];
    try {
      const response = await spotifyClient?.getAlbum(albumId);

      if (response) {
        const { body: album } = response;

        tracks = await getAllItems(
          album.tracks,
          (offset) => spotifyClient?.getAlbumTracks(albumId, offset),
        );

        return [...data, ...tracks.map((item) => serializeTrack(item, album.release_date))];
      }

      throw new ProcessorError(`album ${albumId} does not exists`, this.config);
    } catch (err) {
      throw new ProcessorError(`unexpected error. ${err}`, this.config, err);
    }
  }
}
