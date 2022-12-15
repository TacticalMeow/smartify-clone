import { Targets } from '@smarter/shared';
import { AddTracksToPlaylistProcessor } from 'logic/processors/targets/addTracksToSpotifyPlaylist';
import { ProcessorById } from 'logic/processors/types';

export const TargetProcessors: ProcessorById<Targets> = {
  [Targets.AddTracksToPlaylist]: AddTracksToPlaylistProcessor,
};
