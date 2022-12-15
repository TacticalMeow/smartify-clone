import {
  Node, Edge, Flow, ProcessorTypes, ProcessorResult,
} from '@smarter/shared';
import { logger } from 'logger';
import { Processor, ProcessorConfig } from 'logic/core/processor';
import { JobResources } from 'logic/core/types';
import { Processors } from 'logic/processors';

function getNextNodesId(
  nodes: Node[],
  edges: Edge[],
): string[] {
  const next = nodes.flatMap((node) => edges.reduce((acc, edge) => {
    if (edge.source === node.id && acc.includes(edge.target) !== true) {
      acc.push(edge.target);
    }

    return acc;
  }, [] as string[]));

  return [...new Set(next)];
}

const DEFAULT_RESOURCES: JobResources = {
  options: {
    isTest: false,
  },
};
export class Job {
  id: string;

  private processorById: {[id: string]:Processor<object>} = {};

  processors: Processor<object>[] = [];

  outputs: Processor<object>[] = [];

  resources: JobResources = DEFAULT_RESOURCES;

  constructor(id: string, flow: Flow, resources: JobResources = DEFAULT_RESOURCES) {
    this.id = id;
    this.resources = resources;

    this.initialize(flow);

    this.processors = Object.values(this.processorById);
    this.outputs = this.processors.filter(
      (processor) => processor.config.processorType === ProcessorTypes.Target,
    );
  }

  private initialize(flow: Flow) {
    logger.debug(`initialize job ${this.id}`);

    const startNodes = flow.nodes.filter((node) => {
      const children = flow.edges.filter((edge) => edge.target === node.id, []);

      return children.length === 0;
    });

    startNodes.forEach((node) => {
      this.createProcessors(
        flow,
        node.id,
      );
    });
  }

  private createProcessors(
    flow: Flow,
    currentNodeId: string,
    previousProcessor: Processor<object> | undefined = undefined,
  ): void {
    const { edges, nodes } = flow;
    const currentNode = nodes.find(({ id }) => id === currentNodeId) as Node;

    const parents = getNextNodesId([currentNode], edges);

    if (Object.keys(this.processorById).includes(currentNode.id) && previousProcessor) {
      this.processorById[currentNodeId].children.push(previousProcessor);

      const nodeChildren = [];
      if (nodeChildren.length === this.processorById[currentNodeId].children.length) {
        parents.forEach(
          (parent) => this.createProcessors(flow, parent, this.processorById[currentNodeId]),
        );
      }
    } else {
      const children = previousProcessor ? [previousProcessor] : [];
      const CurrentProcessor = Processors[currentNode.data.processorId];

      const currentProcessor = new CurrentProcessor(
        {
          nodeId: currentNode.id,
          ...currentNode.data,
        } as ProcessorConfig<any>,
        children,
      );
      this.processorById[currentNodeId] = currentProcessor;

      parents.forEach(
        (parent) => this.createProcessors(flow, parent, currentProcessor),
      );
    }
  }

  public async run(): Promise<ProcessorResult[][]> {
    logger.info(`start job ${this.id}`);

    const result = await Promise.all(this.outputs.map(async (
      output,
    ) => output.run(this.resources)));

    logger.info(`job ${this.id} completed`);

    return result;
  }
}
