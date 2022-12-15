import { ProcessorIds, ProcessorTypes } from '@smarter/shared';

export type CreateNodeParams = {
    processorId: ProcessorIds
    processorType:ProcessorTypes
    params: any
    displayName: string
  }
