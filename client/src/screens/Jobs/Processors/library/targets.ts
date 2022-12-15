import {
  ProcessorTypes,
  AddTracksToPlaylistTarget as GetPlaylistSourceType,
  Targets,
} from '@smarter/shared';
import { ProcessorById, Processor, ProcessorParamTypes } from 'screens/Jobs/Processors/library/types';

const AddTracksToPlaylistTarget: Processor<GetPlaylistSourceType> = {
  processorId: Targets.AddTracksToPlaylist,
  displayName: 'Add To Spotify Playlist',
  processorTypeDisplayName: 'Add To Spotify Playlist',
  description: 'Add the tracks from the stream to the given playlist. it creates new playlist if it does not exists',
  processorType: ProcessorTypes.Target,
  paramsConfig: [
    {
      name: 'playlistName',
      description: 'The name of the playlist',
      required: true,
      type: ProcessorParamTypes.Text,
      ComponentProps: {
        placeholder: 'Playlist Name',
      },
    },
  ],
  params: {
    playlistName: '',
  },
};

export const TargetProcessors: ProcessorById<Targets> = {
  [Targets.AddTracksToPlaylist]: AddTracksToPlaylistTarget,
};
