import { Actions } from './actions';
import { Sources } from './sources';
import { Targets } from './targets';

export enum ProcessorTypes {
    Source = 'source',
    Action = 'action',
    Target = 'target'
}

export type BaseProcessorData<T> = {
    processorId: ProcessorIds;
    displayName?: string;
    description: string | JSX.Element;
    processorType: ProcessorTypes;
    params: T;
}
export const ProcessorIds = { ...Sources, ...Actions, ...Targets };
export type ProcessorIds = Sources | Actions | Targets
