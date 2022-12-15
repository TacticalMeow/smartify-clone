/* eslint-disable camelcase */
import { SpotifyAudioFeaturesFullObject } from '@smarter/shared';
import _ from 'lodash';
import { cache, CacheOptions } from 'services/cache';
import SpotifyWebApi from 'spotify-web-api-node';

export const getTracksAudioFeatures = async (
  trackIds: string[],
  client: SpotifyWebApi,
): Promise<{[trackId: string]: SpotifyAudioFeaturesFullObject}> => {
  const {
    found,
    notFound,
  } = cache.mgetDiff<SpotifyAudioFeaturesFullObject>(trackIds, CacheOptions.AudioFeatures);

  const chunks = _.chunk(notFound, 100);

  const features = _.flatten(await Promise.all((chunks.map(async (chunk: string[]) => {
    const response = await client.getAudioFeaturesForTracks(chunk);
    if (response) {
      const { body: { audio_features } } = response;
      return [...audio_features];
    }
    return [];
  }))));
  const audioFeaturesById = features.filter((n) => n != null).map((item) => ({
    key: item.id,
    val: _.mapKeys(item, (v, k) => _.camelCase(k)),
  }));

  cache.mset(audioFeaturesById, CacheOptions.AudioFeatures);

  const audioFeatures = audioFeaturesById.reduce((acc, item) => ({
    ...acc,
    [item.key]: item.val,
  }), {});

  return { ...audioFeatures, ...found };
};
