import { GenerateMoreTracksLike, ProcessorResult } from '@smarter/shared';
import _ from 'lodash';
import { Processor } from 'logic/core/processor';
import { JobResources } from 'logic/core/types';
import { ProcessorError } from 'logic/processors/processorError';
import { serializeTrack } from 'logic/processors/sources/utils/serializeTrack';
import SpotifyApi from 'spotify-web-api-node';

export class GenerateMoreTracksLikeProcessor extends Processor<GenerateMoreTracksLike> {
  async process(
    jobResources: JobResources,
    data: ProcessorResult[] = [],
  ): Promise<ProcessorResult[]> {
    const { spotifyClient } = jobResources;
    const { limit } = this.config.params;

    try {
      const trackIds = _(data.map((track) => track.id)).shuffle().chunk(5).first();
      const response = await spotifyClient?.getRecommendations({ seed_tracks: trackIds, limit });

      if (response) {
        const { body: { tracks } } = response;

        return [...data, ...tracks.map((item) => serializeTrack(item, (item as any)?.album?.release_date || ''))];
      }

      const error = new ProcessorError('failed to generate tracks', this.config);
      error.log();

      return data;
    } catch (err) {
      throw new ProcessorError(`unexpected error. ${err}`, this.config, err);
    }
  }
}
