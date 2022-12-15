import { ProcessorResult, GetPlaylistSource } from '@smarter/shared';
import { Processor } from 'logic/core/processor';
import { JobResources } from 'logic/core/types';
import { ProcessorError } from 'logic/processors/processorError';
import { extractId } from 'logic/processors/sources/utils/extractId';
import { serializeTrack } from 'logic/processors/sources/utils/serializeTrack';
import { getAllItems } from 'logic/processors/utils/getAllItems';
import SpotifyApi from 'spotify-web-api-node';

const PLAYLIST_RESOURCE_NAME = 'playlist';

export class GetPlaylistProcessor extends Processor<GetPlaylistSource> {
  async process(
    jobResources: JobResources,
    data: ProcessorResult[] = [],
  ): Promise<ProcessorResult[]> {
    const { spotifyClient } = jobResources;
    const { playlist } = this.config.params;

    const playlistId = extractId(playlist, PLAYLIST_RESOURCE_NAME);
    const limit = 50;
    let tracks = [];

    try {
      const response = await spotifyClient?.getPlaylistTracks(playlistId, { limit });

      if (response) {
        const { body } = response;
        tracks = await getAllItems<SpotifyApi.PlaylistTrackObject>(
          body,
          (offset) => spotifyClient?.getPlaylistTracks(playlistId, offset),
          limit,
        );
        const serializedTracks = tracks.reduce((acc, item) => {
          if (item.track) {
            return [...acc, serializeTrack(item.track)];
          }
          return acc;
        }, [] as ProcessorResult[]);

        return [...data, ...serializedTracks];
      }

      throw new ProcessorError(`playlist ${playlistId} does not exists`, this.config);
    } catch (err) {
      throw new ProcessorError(`unexpected error. ${err}`, this.config, err);
    }
  }
}
