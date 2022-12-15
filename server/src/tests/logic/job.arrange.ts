export const TWO_NODES_TO_TWO_DIFFERENT_NODES_AND_THEN_ONE_NODE = {
  nodes: [{
    id: '5d8b0042-2bd3-49a7-a727-fea2b32bc843',
    type: 'source',
    data: {
      displayName: 'get1', processorId: 'FROM_SPOTIFY_PLAYLIST', params: { uri: '' }, processorType: 'source', uri: 'get1',
    },
  }, {
    id: '053fcd1c-fa27-4157-a41e-12680de44721',
    type: 'source',
    data: {
      displayName: 'get2', processorId: 'FROM_SPOTIFY_PLAYLIST', params: { uri: '' }, processorType: 'source', uri: 'get2',
    },
  }, {
    id: '2bb2de03-6a35-43b7-beb0-73164be9e674',
    type: 'action',
    data: {
      displayName: 'sample1', processorId: 'SAMPLE', params: { count: 0 }, processorType: 'action', count: '1',
    },
  }, {
    id: '8ccaecea-c458-47f6-abf9-996c2643276a',
    type: 'action',
    data: {
      displayName: 'sample2', processorId: 'SAMPLE', params: { count: 0 }, processorType: 'action', count: '2',
    },
  }, {
    id: 'a6b7bfa3-a94a-4325-bd2d-a6987183f1a1',
    type: 'action',
    data: {
      displayName: 'both', processorId: 'SAMPLE', params: { count: 0 }, processorType: 'action', count: '1',
    },
  }, {
    id: '1506a02c-ea28-481e-9252-cb303effe4d3',
    type: 'target',
    data: {
      displayName: 'output', processorId: 'TO_SPOTIFY_PLAYLIST', params: { playlistName: '' }, processorType: 'target',
    },
  }],
  edges: [{
    source: '5d8b0042-2bd3-49a7-a727-fea2b32bc843', target: '2bb2de03-6a35-43b7-beb0-73164be9e674',
  }, {
    source: '053fcd1c-fa27-4157-a41e-12680de44721', target: '8ccaecea-c458-47f6-abf9-996c2643276a',
  }, {
    source: '2bb2de03-6a35-43b7-beb0-73164be9e674', target: 'a6b7bfa3-a94a-4325-bd2d-a6987183f1a1',
  }, {
    source: '8ccaecea-c458-47f6-abf9-996c2643276a', target: 'a6b7bfa3-a94a-4325-bd2d-a6987183f1a1',
  }, {
    source: 'a6b7bfa3-a94a-4325-bd2d-a6987183f1a1', target: '1506a02c-ea28-481e-9252-cb303effe4d3',
  }],
  viewport: { x: -506.15107380863094, y: 231.99917295410603, zoom: 0.7578582832551992 },
};

export const EXPECTED_TWO_NODES_TO_TWO_DIFFERENT_NODES_AND_THEN_ONE_NODE = [{
  config: {
    displayName: 'get1', processorId: 'FROM_SPOTIFY_PLAYLIST', params: { uri: '' }, processorType: 'source', uri: 'get1',
  },
  children: [],
}, {
  config: {
    displayName: 'sample1', processorId: 'SAMPLE', params: { count: 0 }, processorType: 'action', count: '1',
  },
  children: [{
    config: {
      displayName: 'get1', processorId: 'FROM_SPOTIFY_PLAYLIST', params: { uri: '' }, processorType: 'source', uri: 'get1',
    },
    children: [],
  }],
}, {
  config: {
    displayName: 'both', processorId: 'SAMPLE', params: { count: 0 }, processorType: 'action', count: '1',
  },
  children: [{
    config: {
      displayName: 'sample1', processorId: 'SAMPLE', params: { count: 0 }, processorType: 'action', count: '1',
    },
    children: [{
      config: {
        displayName: 'get1', processorId: 'FROM_SPOTIFY_PLAYLIST', params: { uri: '' }, processorType: 'source', uri: 'get1',
      },
      children: [],
    }],
  }, {
    config: {
      displayName: 'sample2', processorId: 'SAMPLE', params: { count: 0 }, processorType: 'action', count: '2',
    },
    children: [{
      config: {
        displayName: 'get2', processorId: 'FROM_SPOTIFY_PLAYLIST', params: { uri: '' }, processorType: 'source', uri: 'get2',
      },
      children: [],
    }],
  }],
}, {
  config: {
    displayName: 'output', processorId: 'TO_SPOTIFY_PLAYLIST', params: { playlistName: '' }, processorType: 'target',
  },
  children: [{
    config: {
      displayName: 'both', processorId: 'SAMPLE', params: { count: 0 }, processorType: 'action', count: '1',
    },
    children: [{
      config: {
        displayName: 'sample1', processorId: 'SAMPLE', params: { count: 0 }, processorType: 'action', count: '1',
      },
      children: [{
        config: {
          displayName: 'get1', processorId: 'FROM_SPOTIFY_PLAYLIST', params: { uri: '' }, processorType: 'source', uri: 'get1',
        },
        children: [],
      }],
    }, {
      config: {
        displayName: 'sample2', processorId: 'SAMPLE', params: { count: 0 }, processorType: 'action', count: '2',
      },
      children: [{
        config: {
          displayName: 'get2', processorId: 'FROM_SPOTIFY_PLAYLIST', params: { uri: '' }, processorType: 'source', uri: 'get2',
        },
        children: [],
      }],
    }],
  }],
}, {
  config: {
    displayName: 'get2', processorId: 'FROM_SPOTIFY_PLAYLIST', params: { uri: '' }, processorType: 'source', uri: 'get2',
  },
  children: [],
}, {
  config: {
    displayName: 'sample2', processorId: 'SAMPLE', params: { count: 0 }, processorType: 'action', count: '2',
  },
  children: [{
    config: {
      displayName: 'get2', processorId: 'FROM_SPOTIFY_PLAYLIST', params: { uri: '' }, processorType: 'source', uri: 'get2',
    },
    children: [],
  }],
}];

export const TWO_NODES_TO_SAME_NODE = {
  nodes: [{
    id: 'get1',
    type: 'source',
    data: {
      displayName: 'Get Spotify Playlist', processorId: 'FROM_SPOTIFY_PLAYLIST', params: { uri: '' }, processorType: 'source',
    },
  }, {
    id: 'get2',
    type: 'source',
    data: {
      displayName: 'Get Spotify Playlist', processorId: 'FROM_SPOTIFY_PLAYLIST', params: { uri: '' }, processorType: 'source',
    },
  }, {
    id: 'both',
    type: 'action',
    data: {
      displayName: 'Sample', processorId: 'SAMPLE', params: { count: 0 }, processorType: 'action',
    },
  }, {
    id: 'output',
    type: 'target',
    data: {
      displayName: 'Create Spotify Playlist', processorId: 'TO_SPOTIFY_PLAYLIST', params: { playlistName: '' }, processorType: 'target',
    },
  }],
  edges: [{
    source: 'ff9c27e3-4693-4936-87e1-dce2a0935ad1', target: '6d22096e-d619-44cf-aa40-e87fa837deae',
  }, {
    source: '4ac452df-de53-4411-8684-afe242890777', target: '6d22096e-d619-44cf-aa40-e87fa837deae',
  }, {
    source: '6d22096e-d619-44cf-aa40-e87fa837deae', target: '7ea51dab-9a7c-44c1-a0f7-0dad522487ce',
  }],
  viewport: { x: -150.23882396762758, y: 198.6981882602023, zoom: 0.6597539553864472 },
};

export const EXPECTED_TWO_NODES_TO_SAME_NODE = [{
  config: {
    displayName: 'Get Spotify Playlist', processorId: 'FROM_SPOTIFY_PLAYLIST', params: { uri: '' }, processorType: 'source',
  },
  children: [],
}, {
  config: {
    displayName: 'Get Spotify Playlist', processorId: 'FROM_SPOTIFY_PLAYLIST', params: { uri: '' }, processorType: 'source',
  },
  children: [],
}, {
  config: {
    displayName: 'Sample', processorId: 'SAMPLE', params: { count: 0 }, processorType: 'action',
  },
  children: [],
}, {
  config: {
    displayName: 'Create Spotify Playlist', processorId: 'TO_SPOTIFY_PLAYLIST', params: { playlistName: '' }, processorType: 'target',
  },
  children: [],
}];
