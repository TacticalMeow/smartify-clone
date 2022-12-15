/* eslint-disable max-len */
import {
  GetAlbumSource as GetAlbumSourceType,
  GetArtistRadioSource as GetArtistRadioSourceType,
  GetPlaylistSource as GetPlaylistSourceType,
  GetArtistTopTracksSource as GetArtistTopTracksSourceType,
  GetMyTopTracksSource as GetMyTopTracksSourceType,
  GetTrackRadio as GetTrackRadioType,
  ProcessorTypes,
  Sources,
  GetFollowedArtistsTopTracksSource as GetFollowedArtistsTopTracksSourceType,
  SpotifyMyTopOptions,
} from '@smarter/shared';
import { markets } from 'screens/Jobs/Processors/library/markets';
import { ProcessorById, Processor, ProcessorParamTypes } from 'screens/Jobs/Processors/library/types';
import React from 'react';
import { Typography } from '@mui/material';
import { SelectParamProps } from 'screens/Jobs/EditProcessor/Params/types';
import _ from 'lodash';

const GetPlaylistSource: Processor<GetPlaylistSourceType> = {
  processorId: Sources.GetPlaylist,
  displayName: 'Playlist',
  processorTypeDisplayName: 'Playlist',
  description: 'Returns all the tracks from the given playlist',
  processorType: ProcessorTypes.Source,
  paramsConfig: [
    {
      name: 'playlist',
      required: true,
      type: ProcessorParamTypes.Text,
      description: 'The playlist ID, link or spotify uri',
    },
  ],
  params: {
    playlist: '',
  },
};

const GetAlbumSource: Processor<GetAlbumSourceType> = {
  processorId: Sources.GetAlbum,
  displayName: 'Album',
  processorTypeDisplayName: 'Album',
  description: 'Returns all the tracks from the given album',
  processorType: ProcessorTypes.Source,
  paramsConfig: [
    {
      name: 'album',
      required: true,
      type: ProcessorParamTypes.Text,
      description: 'The album ID, link or spotify uri',
    },
  ],
  params: {
    album: '',
  },
};

const GetTrackRadio: Processor<GetTrackRadioType> = {
  processorId: Sources.GetTrackRadio,
  displayName: 'Track Radio',
  processorTypeDisplayName: 'Track Radio',
  description: 'This processor will generate a stream of tracks by the given track.',
  processorType: ProcessorTypes.Source,
  paramsConfig: [
    {
      name: 'track',
      required: true,
      type: ProcessorParamTypes.Text,
      description: 'The track ID, link or spotify uri',
    },
  ],
  params: {
    track: '',
  },
};

const GetArtistRadioSource: Processor<GetArtistRadioSourceType> = {
  processorId: Sources.GetArtistRadio,
  displayName: 'Artist Radio',
  processorTypeDisplayName: 'Artist Radio',
  description: 'This processor will generate a stream of tracks by the given artist and similar artists.',
  processorType: ProcessorTypes.Source,
  paramsConfig: [
    {
      name: 'artist',
      required: true,
      type: ProcessorParamTypes.Text,
      description: 'The artist ID, link or spotify uri',
    },
  ],
  params: {
    artist: '',
  },
};

const GetArtistTopTracksSource: Processor<GetArtistTopTracksSourceType> = {
  processorId: Sources.GetArtistTopTracks,
  displayName: 'Artist Top Tracks',
  processorTypeDisplayName: 'Artist Top Tracks',
  description: 'This processor will generate the top 10 tracks for the given artist.',
  processorType: ProcessorTypes.Source,
  paramsConfig: [
    {
      name: 'artist',
      required: true,
      type: ProcessorParamTypes.Text,
      description: 'The artist ID, link or spotify uri',
    },
    {
      name: 'market',
      required: false,
      type: ProcessorParamTypes.Select,
      description: 'The top tracks of this artist in specific country. If not given, it will use the user\'s country',
      props: {
        items: [
          ...markets,
        ],
      },
    },
  ],
  params: {
    artist: '',
    market: '',
  },
};

const GetFollowedArtistsTopTracksSource: Processor<GetFollowedArtistsTopTracksSourceType> = {
  processorId: Sources.GetFollowedArtistsTopTracks,
  displayName: 'Followed Artists Top Tracks',
  processorTypeDisplayName: 'Followed Artists Top Tracks',
  description: 'This processor will generate tracks for each one of your followed artists.',
  processorType: ProcessorTypes.Source,
  paramsConfig: [
    {
      name: 'market',
      required: false,
      type: ProcessorParamTypes.Select,
      description: 'The top tracks of this artist in specific country. If not given, it will use the user\'s country',
      props: {
        items: [
          ...markets,
        ],
      },
    },
  ],
  params: {
    market: '',
  },
};

const GetMySavedAlbumsSource: Processor<Record<string, never>> = {
  processorId: Sources.GetMySavedAlbums,
  displayName: 'My Saved Albums',
  processorTypeDisplayName: 'My Saved Albums',
  description: 'This processor will generate a stream of tracks from the current user\'s saved albums.',
  processorType: ProcessorTypes.Source,
  paramsConfig: [],
  params: {},
};

const GetMySavedTracks: Processor<Record<string, never>> = {
  processorId: Sources.GetMySavedTracks,
  displayName: 'My Saved Tracks',
  processorTypeDisplayName: 'My Saved Tracks',
  description: 'This processor will generate a stream of tracks from the current user\'s saved tracks.',
  processorType: ProcessorTypes.Source,
  paramsConfig: [],
  params: {},
};

const GetMyTopTracks: Processor<GetMyTopTracksSourceType, SelectParamProps> = {
  processorId: Sources.GetMyTopTracks,
  processorTypeDisplayName: 'My Top Tracks',
  displayNameTemplate: 'My Top Tracks in {timeRange}',
  description: (
    <>
      <Typography>
        This processor will generate a stream of your most listened to tracks from your listening history.
        The top tracks are available over three time spans:
      </Typography>
      <ul>
        <li>
          <b>Short term: </b>
          the last month or so
        </li>
        <li>
          <b>Medium term: </b>
          the last half year or so
        </li>
        <li>
          <b>Long term: </b>
          the last several years
        </li>
      </ul>
    </>
  ),
  processorType: ProcessorTypes.Source,
  paramsConfig: [
    {
      name: 'timeRange',
      required: false,
      type: ProcessorParamTypes.Select,
      description: '',
      props: {
        items: Object.values(SpotifyMyTopOptions),
        resolveLabel: (value) => _.startCase(value),
      },
    },
  ],
  params: {
    timeRange: SpotifyMyTopOptions.MediumTerm,
  },
};

export const SourceProcessors: ProcessorById<Sources> = {
  [Sources.GetPlaylist]: GetPlaylistSource,
  [Sources.GetAlbum]: GetAlbumSource,
  [Sources.GetArtistRadio]: GetArtistRadioSource,
  [Sources.GetArtistTopTracks]: GetArtistTopTracksSource,
  [Sources.GetFollowedArtistsTopTracks]: GetFollowedArtistsTopTracksSource,
  [Sources.GetMySavedAlbums]: GetMySavedAlbumsSource,
  [Sources.GetMySavedTracks]: GetMySavedTracks,
  [Sources.GetMyTopTracks]: GetMyTopTracks,
  [Sources.GetTrackRadio]: GetTrackRadio,
};
