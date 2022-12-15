import _ from 'lodash';
import { getAllItems } from 'logic/processors/utils/getAllItems';
import SpotifyApi from 'spotify-web-api-node';

export const saveTracksToSpotifyPlaylist = async (
  spotifyClient: SpotifyApi,
  playlistName: string,
  trackIds: string[],
): Promise<boolean> => {
  let existingPlaylist = null;

  try {
    const response = await spotifyClient?.getUserPlaylists();
    if (response) {
      const userPlaylists = await getAllItems<SpotifyApi.PlaylistObjectSimplified>(
        response.body,
        (offset) => spotifyClient?.getUserPlaylists(offset),
      );
      existingPlaylist = userPlaylists.find((playlist) => playlist.name === playlistName);
    }
  } catch (err: any) {
    if (err.statusCode !== 404) {
      throw err;
    }
  }

  let playlist: SpotifyApi.PlaylistObjectSimplified;
  if (existingPlaylist) {
    playlist = existingPlaylist;
  } else {
    const newPlaylist = await spotifyClient?.createPlaylist(playlistName);
    playlist = newPlaylist?.body;
  }

  if (playlist) {
    const chunks = _.chunk(trackIds, 100);

    const firstChunk = chunks.shift() || [];
    await spotifyClient?.replaceTracksInPlaylist(playlist.id, firstChunk);

    if (chunks.length > 0) {
      await Promise.all(chunks.map(
        async (chunk) => spotifyClient?.addTracksToPlaylist(
          playlist.id,
          chunk,
        ),
      ));
    }

    return true;
  }

  return false;
};
