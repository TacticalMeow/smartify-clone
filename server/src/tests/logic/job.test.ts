import { Flow } from '@smarter/shared';
import { expect } from 'chai';
import { Job } from 'logic/core/job';
import { Processor } from 'logic/core/processor';
import {
  EXPECTED_TWO_NODES_TO_SAME_NODE, EXPECTED_TWO_NODES_TO_TWO_DIFFERENT_NODES_AND_THEN_ONE_NODE,
  TWO_NODES_TO_SAME_NODE, TWO_NODES_TO_TWO_DIFFERENT_NODES_AND_THEN_ONE_NODE,
} from 'tests/logic/job.arrange';

describe('Job', () => {
  context(`
  * -> *
         -> * -> *
  * -> *
  `, () => {
    it('should be parsed correctly', () => {
      const flow = TWO_NODES_TO_TWO_DIFFERENT_NODES_AND_THEN_ONE_NODE;
      const job = new Job('jobId', flow as unknown as Flow);

      const expected = EXPECTED_TWO_NODES_TO_TWO_DIFFERENT_NODES_AND_THEN_ONE_NODE;

      expect(JSON.stringify(job.processors)).to.eq(JSON.stringify(expected));
    });

    it('should run', async () => {
      const get1 = new Processor<any>({ displayName: 'get1' } as any, []);
      get1.process = async (resources, data) => ['A', 'B', 'C', 'C'] as any;
      const get2 = new Processor<any>({ displayName: 'get2' } as any, []);
      get2.process = async (resources, data) => ['B', 'C', 'D', 'E', 'E', 'E'] as any;
      const dedup1 = new Processor<any>({ displayName: 'dedup1' } as any, [get1]);
      dedup1.process = async (resources, data: any[]) => [...new Set(data)];
      const dedup2 = new Processor<any>({ displayName: 'dedup2' } as any, [get2]);
      dedup2.process = async (resources, data: any[]) => [...new Set(data)];
      const dedup3 = new Processor<any>({ displayName: 'dedup3' } as any, [dedup1, dedup2]);
      dedup3.process = async (resources, data: any[]) => [...new Set(data)];
      const target = new Processor<any>({ displayName: 'target' } as any, [dedup3]);
      target.process = async (resources, data: any[]) => data;

      const flow = TWO_NODES_TO_TWO_DIFFERENT_NODES_AND_THEN_ONE_NODE;
      const job = new Job('jobId', flow as unknown as Flow);
      job.processors = [get1, get2, dedup1, dedup2, dedup3, target];
      job.outputs = [target];

      const result = await job.run();

      expect(result[0]).to.eql(['A', 'B', 'C', 'D', 'E']);
    });
  });

  context(`
  *
    -> * -> *
  *
  `, () => {
    it('should be parsed correctly', () => {
      const flow = TWO_NODES_TO_SAME_NODE;
      const job = new Job('jobId', flow as unknown as Flow);

      const expected = EXPECTED_TWO_NODES_TO_SAME_NODE;

      expect(JSON.stringify(job.processors)).to.eq(JSON.stringify(expected));
    });

    it('should run', async () => {
      const get1 = new Processor<any>({ displayName: 'get1' } as any, []);
      get1.process = async (resources, data) => ['A'] as any;
      const get2 = new Processor<any>({ displayName: 'get2' } as any, []);
      get2.process = async (resources, data) => ['B', 'C'] as any;
      const action = new Processor<any>({ displayName: 'action' } as any, [get1, get2]);
      action.process = async (resources, data: any[]) => data.filter((d) => d !== 'C');
      const target = new Processor<any>({ displayName: 'target' } as any, [action]);
      target.process = async (resources, data: any[]) => data;

      const flow = TWO_NODES_TO_SAME_NODE;
      const job = new Job('jobId', flow as unknown as Flow);
      job.processors = [get1, get2, action, target];
      job.outputs = [target];

      const result = await job.run();

      expect(result[0]).to.eql(['A', 'B']);
    });
  });
});
