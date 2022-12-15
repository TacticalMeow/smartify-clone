import { ProcessorResult, AddTracksToPlaylistTarget } from '@smarter/shared';
import _ from 'lodash';
import { Processor } from 'logic/core/processor';
import { JobResources } from 'logic/core/types';
import { ProcessorError } from 'logic/processors/processorError';
import { saveTracksToSpotifyPlaylist } from 'logic/processors/utils/saveTracksToSpotifyPlaylist';

export class AddTracksToPlaylistProcessor extends Processor<AddTracksToPlaylistTarget> {
  async process(
    jobResources: JobResources,
    data: ProcessorResult[] = [],
  ): Promise<ProcessorResult[]> {
    const { spotifyClient, options } = jobResources;
    const { playlistName } = this.config.params;

    if (options.isTest || !spotifyClient) {
      return data;
    }

    let isOk = false;
    try {
      const trackIds = data.map((track) => track.uri);
      isOk = await saveTracksToSpotifyPlaylist(spotifyClient, playlistName, trackIds);
    } catch (err) {
      throw new ProcessorError(`unexpected error. ${err}`, this.config, err);
    }

    if (isOk) {
      return data;
    }

    throw new ProcessorError(`failed to add songs to playlist ${playlistName}`, this.config);
  }
}
