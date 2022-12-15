import {
  FilterByAudioFeatures, ProcessorResult, SpotifyAudioFeatures,
} from '@smarter/shared';
import { Processor } from 'logic/core/processor';
import { JobResources } from 'logic/core/types';
import { ProcessorError } from 'logic/processors/processorError';
import { getTracksAudioFeatures } from 'logic/processors/utils/getTracksAudioFeatures';
import SpotifyWebApi from 'spotify-web-api-node';

export class FilterByAudioFeaturesProcessor extends Processor<FilterByAudioFeatures> {
  async process(
    jobResources: JobResources,
    data: ProcessorResult[] = [],
  ): Promise<ProcessorResult[]> {
    const { spotifyClient } = jobResources;
    const requestedTrackFeatures = this.config.params;
    try {
      const trackIds = data.map((item) => item.id);
      const features = await getTracksAudioFeatures(trackIds, spotifyClient as SpotifyWebApi);

      if (features) {
        return data.filter((track) => {
          const trackFeatures = features[track.id];
          if (!trackFeatures) { return false; }

          const filtered = Object.keys(requestedTrackFeatures).every(
            (key) => {
              const [min, max] = requestedTrackFeatures[key as SpotifyAudioFeatures];
              const trackFeatureScore = trackFeatures[key as SpotifyAudioFeatures];

              return max >= trackFeatureScore && min <= trackFeatureScore;
            },
          );

          return filtered;
        });
      }

      throw new ProcessorError('failed to get any song features', this.config);
    } catch (err) {
      throw new ProcessorError(`unexpected error. ${err}`, this.config, err);
    }
  }
}
