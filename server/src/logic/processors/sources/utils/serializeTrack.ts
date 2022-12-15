import { ProcessorResult } from '@smarter/shared';
import SpotifyApi from 'spotify-web-api-node';

export const serializeTrack = (
  track: SpotifyApi.TrackObjectFull | SpotifyApi.TrackObjectSimplified,
  releaseDate = '',
): ProcessorResult => ({
  id: track.id,
  name: track.name,
  link: track.href,
  artists: track.artists.map((artist) => artist.name),
  length: track.duration_ms,
  releaseDate: (track as SpotifyApi.TrackObjectFull)?.album?.release_date || releaseDate,
  uri: track.uri,
  processorsHistory: [],
});
