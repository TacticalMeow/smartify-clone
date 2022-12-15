import { ProcessorIds } from '@smarter/shared';
import { spotifyBasicClient } from 'apiClients';

type GetData =
typeof spotifyBasicClient.getPlaylist |
typeof spotifyBasicClient.getAlbum |
typeof spotifyBasicClient.getArtist |
typeof spotifyBasicClient.getTrack

export const urlToProcessorId: { [key: string]: {processorId:ProcessorIds,
getData: GetData } } = {
  playlist: {
    processorId: ProcessorIds.GetPlaylist,
    getData: spotifyBasicClient.getPlaylist.bind(spotifyBasicClient),
  },
  album: {
    processorId: ProcessorIds.GetAlbum,
    getData: spotifyBasicClient.getAlbum.bind(spotifyBasicClient),
  },
  artist: {
    processorId: ProcessorIds.GetArtistRadio,
    getData: spotifyBasicClient.getArtist.bind(spotifyBasicClient),
  },
  track: {
    processorId: ProcessorIds.GetTrackRadio,
    getData: spotifyBasicClient.getTrack.bind(spotifyBasicClient),
  },
};
