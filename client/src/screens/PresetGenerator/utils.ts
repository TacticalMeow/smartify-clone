import {
  Flow, SaveJobRequest, SaveJobResponse, Endpoints,
  CreateJobRequest, CreateJobResponse,
  ProcessorIds, ProcessorTypes, FilterByAudioFeatures, Node,
  Edge, AddTracksToPlaylistTarget, TestJobRequest, TestJobResponse,
} from '@smarter/shared';
import _ from 'lodash';
import { smartifyClient, spotifyBasicClient } from 'apiClients';
import { v4 as uuid } from 'uuid';
import { defaultAudioFeatures, MoodToAudiofeatures } from './consts';
import {
  ChipData, Moods, spotifySourceOptions, UserGeneratedData,
} from './types';

type SuperNode = Node & {
  position: {
    x: number;
    y: number;
  };
}

const defaultNodeLocation = 100;

const getfollowedArtistsRadio = async () => {
  const followedArtists = await spotifyBasicClient.getFollowedArtists();
  if (followedArtists) {
    return followedArtists.body.artists.items.map((artist) => ({
      displayName: artist.name,
      processorId: ProcessorIds.GetArtistRadio,
      processorType: ProcessorTypes.Source,
      params: { artist: artist.external_urls.spotify },
    }));
  }
  return [{}];
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getUserData = async (sourceOptions: spotifySourceOptions) => {
  let userData : UserGeneratedData[] = [];
  const userPlaylists = await spotifyBasicClient.getUserPlaylists();
  const savedAlbums = await spotifyBasicClient.getMySavedAlbums();
  const followedArtists = await getfollowedArtistsRadio();

  if (savedAlbums) {
    userData = userData.concat(
      savedAlbums.body.items.map((album) => ({
        displayName: album.album.name,
        processorId: ProcessorIds.GetAlbum,
        processorType: ProcessorTypes.Source,
        params: { album: album.album.external_urls.spotify },
      })),
    );
  }

  if (userPlaylists) {
    userData = userData.concat(userPlaylists.body.items.map((playlist) => ({
      displayName: playlist.name,
      processorId: ProcessorIds.GetPlaylist,
      processorType: ProcessorTypes.Source,
      params: { playlist: playlist.external_urls.spotify },
    })));
  }

  if (sourceOptions === 'all') {
    const newReleases = await spotifyBasicClient.getNewReleases({ limit: 10 });
    if (newReleases) {
      userData = userData.concat(
        newReleases.body.albums.items.map((album) => ({
          displayName: album.name,
          processorId: ProcessorIds.GetAlbum,
          processorType: ProcessorTypes.Source,
          params: { album: album.external_urls.spotify },
        })),
      );
    }
  }
  return [...userData, ...followedArtists] as UserGeneratedData[];
};

// connects flow edges by set rules then returns new fixed flow
const connectEdges = (flow: Flow): Flow => {
  const newFlow = { ...flow };
  const filterByAudioNode = newFlow.nodes.find(
    (node:Node) => (node.data.processorId === ProcessorIds.FilterByAudioFeatures),
  );
  const sourceNodes = newFlow.nodes.filter(
    (node:Node) => (node.data.processorType === ProcessorTypes.Source),
  );
  const deDupNode = newFlow.nodes.find(
    (node:Node) => (node.data.processorId === ProcessorIds.Dedup),
  );

  const shuffleNode = newFlow.nodes.find(
    (node:Node) => (node.data.processorId === ProcessorIds.SeparateArtists),
  );

  const targetNode = newFlow.nodes.find(
    (node:Node) => (node.data.processorType === ProcessorTypes.Target),
  );

  if (deDupNode && filterByAudioNode) {
    newFlow.edges.push({
      id: uuid(),
      source: deDupNode.id,
      target: filterByAudioNode.id,
    } as Edge);
  }

  if (filterByAudioNode && shuffleNode) {
    newFlow.edges.push({
      id: uuid(),
      source: filterByAudioNode.id,
      target: shuffleNode.id,
    } as Edge);
  }

  if (deDupNode && sourceNodes) {
    newFlow.edges = newFlow.edges.concat(sourceNodes.reduce((prev, current) => prev.concat([{
      id: uuid(),
      source: current.id,
      target: deDupNode.id,
    }]), [] as Edge[]));
  }

  if (shuffleNode && targetNode) {
    newFlow.edges.push({
      id: uuid(),
      source: shuffleNode.id,
      target: targetNode.id,
    });
  }

  return newFlow;
};
const shiftNodesByType = (
  nodes: Node[],
  type : ProcessorTypes,
  xoffset:number,
  yoffset:number,
) => nodes.filter(
  (node:Node) => (node.data.processorType === type),
).map((node) => ({
  id: node.id,
  data: node.data,
  type: node.type,
  position: {
    x: xoffset,
    y: yoffset,
  },
}));

// fixes flow node location by set rules then returns new fixed flow
const fixFlowNodeLocations = (flow: Flow): Flow => ({
  edges: [...flow.edges],
  nodes: _.flatten(
    (Object.keys(ProcessorTypes) as Array<keyof typeof ProcessorTypes>)
      .map((processorType) => shiftNodesByType(
        flow.nodes,
        _.lowerCase(processorType) as ProcessorTypes,
        _.lowerCase(processorType) === ProcessorTypes.Source
          ? defaultNodeLocation - 400
          : defaultNodeLocation,
        defaultNodeLocation,
      )),
  ),
  viewport: { ...flow.viewport },
});

// generates a Node (processor) object that
// fits both the React Flow engine and the server API for processing
const generateProcessorNode = (
  displayName: string,
  processorType : ProcessorTypes,
  processorId: ProcessorIds,
  params: Record<string, unknown>,
  xPos?: number,
  yPos?: number,

) : SuperNode => ({
  id: uuid(),
  type: processorType,
  data: {
    processorId,
    processorType,
    params,
    description: 'autogenerated',
    displayName,
  },
  position: {
    x: xPos || defaultNodeLocation,
    y: yPos || defaultNodeLocation,
  },
});

// Applies the selected moods to an AudioFeatures type
export const generateAudioFeaturesByChipData = (moods:ChipData[]):
FilterByAudioFeatures => moods.reduce((prevAudioFeatures, currentChip) => {
  const newAudioFeature = { ...prevAudioFeatures };
  if (MoodToAudiofeatures[currentChip.label as Moods]) {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, val] of Object.entries(MoodToAudiofeatures[currentChip.label as Moods])) {
      newAudioFeature[key as keyof FilterByAudioFeatures] = val;
    }
  }
  return newAudioFeature;
}, defaultAudioFeatures());

export const createJob = async (jobName: string): Promise<string> => {
  const newJob = await smartifyClient
    .post<CreateJobRequest, CreateJobResponse>(
      Endpoints.createJob,
      {
        name: jobName,
      },
    );
  return newJob.data.id;
};

export const saveJob = async (jobId: string, flow: Flow): Promise<void> => {
  if (flow && Object.keys(flow).length !== 0) {
    await smartifyClient.post<SaveJobRequest, SaveJobResponse>(
      Endpoints.saveJob,
      { jobId, flow },
    );
  }
};

export const runJob = async (jobId: string, flow: Flow): Promise<void> => {
  if (flow && Object.keys(flow).length !== 0) {
    await smartifyClient.post<TestJobRequest, TestJobResponse>(
      Endpoints.testJob,
      { id: jobId, flow },
    );
  }
};

const defaultFlow = (playlistName: string, extraNodes?: Node[]):Flow => {
  const flow : Flow = {
    edges: [],
    nodes: [],
    viewport: [],
  };

  flow.nodes = ([
    {
      name: 'dedup',
      type: ProcessorTypes.Action,
      pid: ProcessorIds.Dedup,
      params: {},
    },
    {
      name: 'target playlist',
      type: ProcessorTypes.Target,
      pid: ProcessorIds.AddTracksToPlaylist,
      params: {
        playlistName,
      } as AddTracksToPlaylistTarget,
    }]).map((nodeDesc) => generateProcessorNode(
    nodeDesc.name,
    nodeDesc.type,
    nodeDesc.pid,
    nodeDesc.params,
  ));

  if (extraNodes) {
    flow.nodes = flow.nodes.concat(extraNodes);
  }
  return flow;
};

export const generateFlow = async (
  moods:ChipData[],
  playlistName:string,
  sourceOptions: spotifySourceOptions,
) : Promise<Flow> => {
  let extraNodes :Node[] = [];
  try {
    const userData = await getUserData(sourceOptions);
    if (userData) {
      extraNodes = extraNodes.concat(userData.map((datum) => generateProcessorNode(
        datum.displayName,
        datum.processorType,
        datum.processorId,
        datum.params,
      )));
    }
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('Preset Generator error: couldnt fetch user data from spotify');
  } finally {
    extraNodes.push(generateProcessorNode(
      'audio features',
      ProcessorTypes.Action,
      ProcessorIds.FilterByAudioFeatures,
      generateAudioFeaturesByChipData(moods),
    ), generateProcessorNode(
      'shuffle',
      ProcessorTypes.Action,
      ProcessorIds.SeparateArtists,
      {},
    ));
  }
  return fixFlowNodeLocations(connectEdges(defaultFlow(playlistName, extraNodes)));
};
