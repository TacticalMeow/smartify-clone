import { ActionProcessors } from 'logic/processors/actions';
import { SourceProcessors } from 'logic/processors/sources';
import { TargetProcessors } from 'logic/processors/targets';

export const Processors = {
  ...ActionProcessors,
  ...TargetProcessors,
  ...SourceProcessors,
};
