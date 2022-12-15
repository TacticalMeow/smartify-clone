import {
  BaseProcessorData,
  CreateJobRequest,
  CreateJobResponse,
  Endpoints, Flow, GetJobRequest, GetJobResponse, GetMyJobsResponse, JobDocumentFields,
  SaveJobRequest, SaveJobResponse, RenameJobRequest, RenameJobResponse,
  DeleteJobRequest, DeleteJobResponse, ProcessorTypes, ProcessorIds,
} from '@smarter/shared';
import { smartifyClient } from 'apiClients';
import React, {
  FC, useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactFlow, {
  MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge, useReactFlow,
  ReactFlowProvider, updateEdge, Node, applyNodeChanges, NodeChange, EdgeChange, applyEdgeChanges,
  useKeyPress, ReactFlowInstance,
} from 'react-flow-renderer';
import { Box, useTheme } from '@mui/system';
import SideNavBar, { sidebarWidth } from 'screens/Jobs/SideNavBar';
import './style.css';
import AddProcessorDialog from 'screens/Jobs/ActionBar/AddProcessorDialog';
import { v4 as uuid } from 'uuid';
import { nodeTypes } from 'screens/Jobs/Processors/nodes';
import { urlToProcessorId } from 'screens/Jobs/consts';
import { CreateNodeParams } from 'screens/Jobs/types';
import EditProcessor from 'screens/Jobs/EditProcessor';
import TestJobDialog from 'screens/Jobs/ActionBar/TestJobDialog';
import SaveJobDialog from 'screens/Jobs/ActionBar/SaveJobDialog';
import RestoreJobDialog from 'screens/Jobs/ActionBar/RestoreJobDialog';
import CreateJobDialog from 'screens/Jobs/CreateJobDialog';
import SwitchJobDialog from 'screens/Jobs/SwitchJobDialog';
import SetScheduleDialog from 'screens/Jobs/ActionBar/SetScheduleDialog';
import SettingsDialog from 'screens/Jobs/ActionBar/SettingsDialog';
import ActionBar, { ActionBarOptions } from 'screens/Jobs/ActionBar';
import _ from 'lodash';
import { useAuthContext } from 'contexts/AuthContext';
import { Processor } from 'screens/Jobs/Processors/library/types';
import { ProcessorsLibrary } from './Processors/library';

const onLoad = (reactFlowInstance: any) => {
  reactFlowInstance.fitView();
};

const Jobs: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const globalTheme = useTheme();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [myJobs, setMyJobs] = useState<JobDocumentFields[]>([]);
  const [isMyJobLoading, setIsMyJobLoading] = useState(true);
  const [activeJobId, setActiveJobId] = useState<string>(id as string);

  const [selectedAction, setSelectedAction] = useState<ActionBarOptions | null>(null);
  const [selectedProcessor, setSelectedProcessor] = useState<Node<BaseProcessorData<any>> | null>(
    null,
  );
  const [isEditProcessorOpen, setIsEditProcessorOpen] = useState<boolean>(false);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [isSwitchJobDialogOpen, setIsSwitchJobDialogOpen] = useState(false);
  const [jobIdSwitchToDialog, setJobIdSwitchToDialog] = useState('');

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();
  const { setViewport } = useReactFlow();

  const { userConfig } = useAuthContext();

  const shouldDisableCreateJob = useMemo(
    () => myJobs.length >= userConfig.maximumJobs,
    [],
  );

  const [copiedNodes, setCopiedNodes] = useState<Node[] | null>(null);

  const boundingBox = useRef<HTMLElement>(null);
  const [dimensions, setDimensions] = useState({ x: 0, y: 0 });

  const copyPressed = useKeyPress('Control+c');
  const pastePressed = useKeyPress('Control+v');
  const shiftEnterPressed = useKeyPress('Shift+Enter');

  useEffect(() => {
    if (shiftEnterPressed) {
      setSelectedAction(ActionBarOptions.AddProcessor);
    }
  }, [shiftEnterPressed]);

  const onNodeClick = (event: React.MouseEvent, node: Node<BaseProcessorData<any>>) => {
    setSelectedProcessor(node);
    setTimeout(() => {
      setIsEditProcessorOpen(true);
    });
  };

  const onEdgeUpdate = (
    oldEdge: any,
    newConnection: any,
  ) => setEdges((els) => updateEdge(oldEdge, newConnection, els));

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, type: 'default', animated: false }, eds)),
    [],
  );

  const onNodeDelete = (nodeId: string) => {
    setNodes(() => {
      const changes: NodeChange[] = [{
        id: nodeId,
        type: 'remove',
      }];

      return applyNodeChanges(changes, nodes);
    });
    setEdges(() => {
      const changes: EdgeChange[] = edges.reduce((acc, edge) => {
        if (edge.source === nodeId || edge.target === nodeId) {
          acc.push({ id: edge.id, type: 'remove' });
        }

        return acc;
      }, [] as EdgeChange[]);

      return applyEdgeChanges(changes, edges);
    });
  };

  const getNodeDisplayName = (
    processorParams:any,
    processorId: ProcessorIds,
    displayName: string,
  ) => {
    const processorConfig: Processor<any> = ProcessorsLibrary[processorId];

    if (processorConfig.displayNameTemplate) {
      return Object.entries(processorParams)
        .reduce((acc, [key, value]) => acc.replace(`{${key}}`, _.toString(value)), processorConfig.displayNameTemplate);
    }

    return displayName;
  };

  const onNodeUpdate = (nodeId: string, data: any) => {
    const displayName = getNodeDisplayName(data.params, data.processorId, data.displayName);

    setNodes((nds) => nds.map((node) => {
      if (node.id === nodeId) {
        // eslint-disable-next-line no-param-reassign
        node.data = {
          ...data,
          displayName,
        };
      }
      return node;
    }));
  };

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      const flowFromLocalStorage = JSON.parse(localStorage.getItem(activeJobId) as string);
      if (flowFromLocalStorage == null || !_.isEqual(flow, flowFromLocalStorage)) {
        localStorage.setItem(activeJobId, JSON.stringify(flow));
      }
    }
  }, [rfInstance, activeJobId]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(activeJobId) as string);
      if (flow) {
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport(flow.viewport || { x: 0, y: 0, zoom: 1 });
      }
    };

    restoreFlow();
  }, [activeJobId]);

  /**
   * Close the current action dialog
   */
  const handleActionClose = () => {
    setSelectedAction(null);
  };

  /**
   * Save the current jobId data from localStorage to db
   */
  const saveJobToDb = useCallback(async () => {
    if (activeJobId) {
      const flow = JSON.parse(localStorage.getItem(activeJobId) || '{}') as Flow;

      if (flow && Object.keys(flow).length !== 0) {
        await smartifyClient.post<SaveJobRequest, SaveJobResponse>(
          Endpoints.saveJob,
          { jobId: activeJobId, flow },
        );
      }
    }
  }, [activeJobId]);

  /**
   * restore the current jobId data from db to localStorage. (does not update current rfInstance)
   */
  const restoreJobFromDb = useCallback(async () => {
    if (activeJobId) {
      const response = await smartifyClient.get<GetJobRequest, GetJobResponse>(
        Endpoints.getJob,
        { params: { jobId: activeJobId } },
      );
      const { flow } = response.data;

      if (flow) {
        localStorage.setItem(activeJobId, JSON.stringify(flow));
        onRestore();
      } else {
        // create default flow
        setNodes([]);
        setEdges([]);
        setViewport({ x: 0, y: 0, zoom: 1 });
      }
    }
  }, [activeJobId]);

  const createNode = useCallback(({
    processorId, processorType, params, displayName,
  }: CreateNodeParams) => {
    const nodeName = getNodeDisplayName(params, processorId, displayName);

    const newNode = {
      id: uuid(),
      type: processorType,
      data: {
        displayName: displayName || nodeName,
        processorId,
        params,
        processorType,
      },
      position: {
        x: rfInstance ? rfInstance.project(dimensions).x : 100,
        y: rfInstance ? rfInstance.project(dimensions).y : 100,
      },
    };

    setNodes((nds) => nds.concat(newNode));
  }, [rfInstance, setNodes]);

  const getMyJobs = async () => {
    setIsMyJobLoading(true);

    const response = await smartifyClient.get<any, GetMyJobsResponse>(
      Endpoints.getMyJobs,
    );

    setMyJobs(response.data);

    setIsMyJobLoading(false);
  };

  /**
   * handles the drag and drop string
   * @param url coming from dropped url
   */
  const handleDragDropData = useCallback((async (url: string) => {
    const spotifyGetSourceRegex = /(?<=https:\/\/open.spotify.com\/).*(?=\/.*)/;
    const spotifyGetIdRegex = /(?<=https:\/\/open.spotify.com\/.*\/).*/;
    const source = url.match(spotifyGetSourceRegex);
    const idFromUrl = url.match(spotifyGetIdRegex);

    if (source && idFromUrl) {
      const match = source[0] as string;
      const processorData = urlToProcessorId[match];

      if (processorData) {
        const { params } = ProcessorsLibrary[processorData.processorId];
        let displayName = `Source Processor number ${nodes.length + 1}`;

        try {
          const res = await processorData.getData(idFromUrl[0]);
          if (res.body && Object.keys(res.body).find((elem) => (elem === 'name'))) {
            displayName = res.body.name;
          }
        } catch (err) {
          _.noop();
        } finally {
          createNode({
            processorId: processorData.processorId,
            processorType: ProcessorTypes.Source,
            params: {
              ...params,
              [match]: url,
            },
            displayName,
          });
        }
      }
    }
  }), [rfInstance]);

  /**
   * Starts a DragDrop listener
   * @param dataHandler Function to handle data received from DragEvent
   * @param dataKey Key of the data to get from DragEvent
   */
  const startDragDropListener = (dataHandler: (data:any)=>void, dataKey: string):void => {
    const customHandler = (ev: DragEvent) => {
      ev.preventDefault();
      if (ev.type === 'drop' && ev.dataTransfer) { dataHandler(ev.dataTransfer.getData(dataKey)); }
    };
    window.addEventListener('dragenter', customHandler);
    window.addEventListener('dragover', customHandler);
    window.addEventListener('drop', customHandler);
  };

  /**
   * Get all the user's jobs and add drag and drop event listeners
   */
  useEffect(() => {
    startDragDropListener(handleDragDropData, 'text');
    getMyJobs();
  }, []);

  /**
   * Handles the new jobId we switched to
   */
  useEffect(() => {
    const restoreJobsOnStartup = async () => {
      if (myJobs && activeJobId) {
        const flowInLocal = localStorage.getItem(activeJobId);
        if (!flowInLocal) {
          await restoreJobFromDb();
        } else {
          onRestore();
        }
      }
    };
    if (myJobs.length > 0) {
      if (!activeJobId) {
        const jobId = myJobs[0]._id;
        setActiveJobId(jobId);
      }
      navigate(`/jobs/${activeJobId}`);
      restoreJobsOnStartup();
    } else if (!isMyJobLoading) {
      setIsCreateJobOpen(true);
    }
  }, [myJobs, activeJobId, isMyJobLoading]);

  /**
   * By default save any change of the user to the local storage
   * so he will not lose his changes on refresh
   */
  useEffect(() => {
    onSave();
  }, [nodes, edges, activeJobId]);

  useEffect(() => {
    if (rfInstance && copyPressed) {
      const selectedNodes = nodes.filter((node) => node.selected);
      setCopiedNodes(selectedNodes);
    }
  }, [copyPressed]);

  useEffect(() => {
    if (rfInstance && copiedNodes && pastePressed) {
      const nodesToPaste = copiedNodes.map((node) => ({
        ...node,
        id: uuid(),
        position: {
          x: node.position.x + 50,
          y: node.position.y + 50,
        },
      }));

      setNodes((nds) => nds.concat(nodesToPaste));
    }
  }, [pastePressed]);

  /**
   * this is used to make new created nodes position in the middle of the screen
   */
  useEffect(() => {
    if (boundingBox.current) {
      setDimensions({
        x: boundingBox.current.offsetWidth / 2,
        y: boundingBox.current.offsetHeight / 2,
      });
    }
  }, []);

  const deleteJobIdLocalStorage = (jobId: string) => {
    if (jobId) {
      localStorage.removeItem(jobId);
    }
  };

  const jobSwitchToId = (jobId: string) => {
    if (activeJobId) {
      deleteJobIdLocalStorage(activeJobId);
    }
    if (jobId) {
      setActiveJobId(jobId);
    }
  };

  /**
   * wraps logic needed to switch job
   */
  const onJobSwitch = async (jobId: string) => {
    if (jobId && activeJobId) {
      try {
        const flowFromLocalStorage = JSON.parse(localStorage.getItem(activeJobId) || '{}') as Flow;

        const response = await smartifyClient.get<GetJobRequest, GetJobResponse>(
          Endpoints.getJob,
          { params: { jobId: activeJobId } },
        );

        const { flow } = response.data;

        if (
          flow?.edges
          && flow?.nodes
          && flowFromLocalStorage
          && (!_.isEqual(flow.edges, flowFromLocalStorage.edges)
          || !_.isEqual(flow.nodes, flowFromLocalStorage.nodes))) {
          setJobIdSwitchToDialog(jobId);
          setIsSwitchJobDialogOpen(true);
        } else {
          jobSwitchToId(jobId);
        }
      } catch (err:any) {
        jobSwitchToId(jobId);
      }
    }
  };

  const onJobCreate = async (name: string) => {
    const job = await smartifyClient
      .post<CreateJobRequest, CreateJobResponse>(
        Endpoints.createJob,
        {
          name,
        },
      );

    onJobSwitch(job.data.id);
    navigate(`/jobs/${job.data.id}`);

    await getMyJobs();

    setIsCreateJobOpen(false);
  };

  const onJobRename = async (newName: string) => {
    if (activeJobId) {
      const response = await smartifyClient
        .post<RenameJobRequest, RenameJobResponse>(
          Endpoints.renameJob,
          {
            jobId: activeJobId,
            newJobName: newName,
          },
        );
      if (response) {
        await getMyJobs();
      }
    }
  };

  const onJobDelete = async () => {
    if (activeJobId) {
      const response = await smartifyClient
        .post<DeleteJobRequest, DeleteJobResponse>(
          Endpoints.deleteJob,
          {
            jobId: activeJobId,
          },
        );
      if (response) {
        localStorage.removeItem(activeJobId);
        await getMyJobs();
        setTimeout(() => {
          setActiveJobId('');
        }, 500);
      }
    }
  };

  return (
    <>
      <CreateJobDialog
        open={isCreateJobOpen}
        onClose={myJobs.length > 0 ? () => setIsCreateJobOpen(false) : undefined}
        onConfirm={onJobCreate}
        disabled={shouldDisableCreateJob}
      />

      <SwitchJobDialog
        open={isSwitchJobDialogOpen}
        onClose={() => setIsSwitchJobDialogOpen(false)}
        jobIdTo={jobIdSwitchToDialog}
        setSelectedJob={jobSwitchToId}
      />

      <Box
        sx={(theme: any) => ({
          background: theme.palette.background.default,
          display: 'grid',
          minHeight: theme.custom.containerHeight,
          gridTemplateRows: '100vh',
          [theme.breakpoints.up('sm')]: {
            gridTemplateColumns: `${sidebarWidth} 1fr`,
          },
          [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: '0px 100vw',
          },
          gridTemplateAreas: `
          'sidebar flow'
          'sidebar flow'
          'sidebar flow'
        `,
        })}
      >
        <Box sx={{ gridArea: 'sidebar' }}>
          <SideNavBar
            jobs={myJobs}
            selectedJob={activeJobId}
            setSelectedJob={onJobSwitch}
            onAdd={() => setIsCreateJobOpen(true)}
          />
        </Box>

        <Box ref={boundingBox} sx={{ gridArea: 'flow' }}>
          <ReactFlow
            defaultNodes={nodes}
            defaultEdges={edges}
            onLoad={onLoad}
            onConnect={onConnect}
            snapToGrid
            snapGrid={[15, 15]}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onInit={setRfInstance}
            onEdgeUpdate={onEdgeUpdate}
            onNodeDoubleClick={onNodeClick}
            fitView
          >
            {/* Action Bar */}
            <ActionBar setAction={setSelectedAction} jobId={activeJobId} onJobRestore={onRestore} />
            <AddProcessorDialog
              open={selectedAction === ActionBarOptions.AddProcessor}
              onClose={handleActionClose}
              onCreate={createNode}
            />

            <TestJobDialog
              open={selectedAction === ActionBarOptions.TestJob}
              onClose={handleActionClose}
              activeJob={myJobs.find((job) => job._id === activeJobId)}
            />
            <SetScheduleDialog
              open={selectedAction === ActionBarOptions.Schedule}
              onClose={handleActionClose}
              jobId={activeJobId}
              saveJobToDb={saveJobToDb}
            />
            <SaveJobDialog
              open={selectedAction === ActionBarOptions.SaveJob}
              onClose={handleActionClose}
              jobId={activeJobId}
              saveJobToDb={saveJobToDb}
            />
            <RestoreJobDialog
              open={selectedAction === ActionBarOptions.RestoreJob}
              onClose={handleActionClose}
              jobId={activeJobId}
              restoreJobFromDb={restoreJobFromDb}
            />
            <SettingsDialog
              open={selectedAction === ActionBarOptions.Settings}
              onClose={handleActionClose}
              jobName={myJobs.find((job) => (job._id === activeJobId))?.name}
              jobId={activeJobId}
              renameJob={onJobRename}
              deleteJob={onJobDelete}
            />

            <MiniMap
              nodeStrokeColor={(n) => {
                if (n.style?.background) return n.style.background as string;
                if (n.type === 'input') return '#0041d0';
                if (n.type === 'output') return '#ff0072';
                if (n.type === 'default') return '#1a192b';

                return '#eee';
              }}
              nodeColor={(n) => {
                if (n.style?.background) return n.style.background as string;

                return '#fff';
              }}
              nodeBorderRadius={2}
              style={{
                backgroundColor: globalTheme.palette.background.default,
                border: '1px solid rgba(194, 224, 255, 0.08)',
                borderRadius: globalTheme.shape.borderRadius,
              }}
              maskColor={globalTheme.palette.background.paper}
            />
            <Controls />
            <Background
              style={{
                backgroundColor: globalTheme.palette.background.default,
              }}
            />
          </ReactFlow>
        </Box>
      </Box>

      <EditProcessor
        open={isEditProcessorOpen}
        selectedProcessor={selectedProcessor}
        onClose={() => setIsEditProcessorOpen(false)}
        onUpdate={onNodeUpdate}
        onDelete={onNodeDelete}
      />
    </>
  );
};

// eslint-disable-next-line func-names
export default function () {
  return (
    <ReactFlowProvider>
      <Jobs />
    </ReactFlowProvider>
  );
}
