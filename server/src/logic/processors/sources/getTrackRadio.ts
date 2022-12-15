import { GetTrackRadio, ProcessorResult } from '@smarter/shared';
import { Processor } from 'logic/core/processor';
import { JobResources } from 'logic/core/types';
import { ProcessorError } from 'logic/processors/processorError';
import { extractId } from 'logic/processors/sources/utils/extractId';
import { serializeTrack } from 'logic/processors/sources/utils/serializeTrack';
import SpotifyApi from 'spotify-web-api-node';

const RESOURCE_NAME = 'track';

export class GetTrackRadioProcessor extends Processor<GetTrackRadio> {
  async process(
    jobResources: JobResources,
    data: ProcessorResult[] = [],
  ): Promise<ProcessorResult[]> {
    const { spotifyClient } = jobResources;
    const { track: trackAddress } = this.config.params;

    const trackId = extractId(trackAddress, RESOURCE_NAME);

    try {
      const response = await spotifyClient?.getRecommendations({ seed_tracks: [trackId] });

      if (response) {
        const { body: { tracks } } = response;

        return [...data, ...tracks.map((item) => serializeTrack(item, (item as any)?.album?.release_date || ''))];
      }

      throw new ProcessorError(`track ${trackId} does not exists`, this.config);
    } catch (err) {
      throw new ProcessorError(`unexpected error. ${err}`, this.config, err);
    }
  }
}
