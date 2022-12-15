import { Sources } from '@smarter/shared';
import { GetFollowedArtistsTopTracksProcessor } from 'logic/processors/sources/getFollowedArtistsTopTracks';
import { GetAlbumProcessor } from 'logic/processors/sources/getAlbum';
import { GetArtistRadioProcessor } from 'logic/processors/sources/getArtistRadio';
import { GetArtistTopTracksProcessor } from 'logic/processors/sources/getArtistTopTracks';
import { GetMySavedAlbumsProcessor } from 'logic/processors/sources/getMySavedAlbums';
import { GetMySavedTracksProcessor } from 'logic/processors/sources/getMySavedTracks';
import { GetMyTopTracksProcessor } from 'logic/processors/sources/getMyTopTracks';
import { GetPlaylistProcessor } from 'logic/processors/sources/getPlaylist';
import { ProcessorById } from 'logic/processors/types';
import { GetTrackRadioProcessor } from 'logic/processors/sources/getTrackRadio';

export const SourceProcessors: ProcessorById<Sources> = {
  [Sources.GetPlaylist]: GetPlaylistProcessor,
  [Sources.GetAlbum]: GetAlbumProcessor,
  [Sources.GetArtistRadio]: GetArtistRadioProcessor,
  [Sources.GetArtistTopTracks]: GetArtistTopTracksProcessor,
  [Sources.GetFollowedArtistsTopTracks]: GetFollowedArtistsTopTracksProcessor,
  [Sources.GetMySavedAlbums]: GetMySavedAlbumsProcessor,
  [Sources.GetMySavedTracks]: GetMySavedTracksProcessor,
  [Sources.GetMyTopTracks]: GetMyTopTracksProcessor,
  [Sources.GetTrackRadio]: GetTrackRadioProcessor,
};
