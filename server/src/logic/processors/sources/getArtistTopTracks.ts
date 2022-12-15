import { GetArtistTopTracksSource, ProcessorResult } from '@smarter/shared';
import { Processor } from 'logic/core/processor';
import { JobResources } from 'logic/core/types';
import { ProcessorError } from 'logic/processors/processorError';
import { extractId } from 'logic/processors/sources/utils/extractId';
import { serializeTrack } from 'logic/processors/sources/utils/serializeTrack';

const ARTIST_RESOURCE_NAME = 'artist';

export class GetArtistTopTracksProcessor extends Processor<GetArtistTopTracksSource> {
  async process(
    jobResources: JobResources,
    data: ProcessorResult[] = [],
  ): Promise<ProcessorResult[]> {
    const { spotifyClient } = jobResources;
    const { artist: artistAddress, market: maybeMarket } = this.config.params;

    const artistId = extractId(artistAddress, ARTIST_RESOURCE_NAME);

    try {
      let market = maybeMarket;
      if (!market) {
        try {
          const user = await (await spotifyClient?.getMe());
          market = user?.body.country;
        } catch (err) {
          throw new ProcessorError(`failed to get spotify user. ${err}`, this.config, err);
        }
      }
      const response = await spotifyClient?.getArtistTopTracks(artistId, market as string);

      if (response) {
        const { body: { tracks } } = response;

        return [...data, ...tracks.map((item) => serializeTrack(item, (item as any)?.album?.release_date || ''))];
      }

      throw new ProcessorError(`artist or market ${artistId} does not exists`, this.config);
    } catch (err) {
      throw new ProcessorError(`unexpected error. ${err}`, this.config, err);
    }
  }
}
