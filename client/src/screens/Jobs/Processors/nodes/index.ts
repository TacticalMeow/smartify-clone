import { ProcessorTypes } from '@smarter/shared';
import ActionProcessor from 'screens/Jobs/Processors/nodes/ActionProcessor';
import SourceProcessor from 'screens/Jobs/Processors/nodes/SourceProcessor';
import TargetProcessor from 'screens/Jobs/Processors/nodes/TargetProcessor';

export const nodeTypes = {
  [ProcessorTypes.Action]: ActionProcessor,
  [ProcessorTypes.Source]: SourceProcessor,
  [ProcessorTypes.Target]: TargetProcessor,
};
