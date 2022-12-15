import { GetArtistTopTracksSource, ProcessorResult } from '@smarter/shared';
import _ from 'lodash';
import { Processor } from 'logic/core/processor';
import { JobResources } from 'logic/core/types';
import { ProcessorError } from 'logic/processors/processorError';
import { serializeTrack } from 'logic/processors/sources/utils/serializeTrack';

export class GetFollowedArtistsTopTracksProcessor extends Processor<GetArtistTopTracksSource> {
  async process(
    jobResources: JobResources,
    data: ProcessorResult[] = [],
  ): Promise<ProcessorResult[]> {
    const { spotifyClient } = jobResources;
    const { market: maybeMarket } = this.config.params;

    try {
      let market = maybeMarket;
      if (!market) {
        try {
          const user = await spotifyClient?.getMe();
          market = user?.body.country;
        } catch (err) {
          throw new ProcessorError(`failed to get spotify user. ${err}`, this.config, err);
        }
      }
      const response = await spotifyClient?.getFollowedArtists();
      const myFollowedArtists: string[] = [];
      if (response) {
        let { body: { artists } } = response;
        while (artists.next) {
          myFollowedArtists.push(...artists.items.map((a) => a.id));

          // eslint-disable-next-line no-await-in-loop
          const nextPageResponse = await spotifyClient?.getFollowedArtists(
            { after: _.last(myFollowedArtists) },
          );

          if (nextPageResponse) {
            artists = nextPageResponse.body.artists;
          } else {
            break;
          }
        }
      }

      const tracks = await Promise.all(myFollowedArtists.map(async (id) => {
        const artistTopTracksResponse = await spotifyClient?.getArtistTopTracks(
          id,
          market as string,
        );
        return artistTopTracksResponse ? artistTopTracksResponse.body.tracks : [];
      }));

      return [...data, ..._.flatten(tracks).map((item) => serializeTrack(item))];
    } catch (err) {
      throw new ProcessorError(`unexpected error. ${err}`, this.config, err);
    }
  }
}
