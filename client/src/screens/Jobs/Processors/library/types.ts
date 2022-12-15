import { BaseProcessorData } from '@smarter/shared';
import { ProcessorParamComponentProps } from 'screens/Jobs/EditProcessor/Params/types';

export type ProcessorById<T extends string> =
{[key in T] : Processor<Record<string, unknown>> | Processor<Record<string, unknown>[]>}

export enum ProcessorParamTypes {
    Text = 'text',
    Multiline = 'multiline',
    Number = 'number',
    Checkbox = 'checkbox',
    Select = 'select',
    Slider = 'slider',
    TimePicker = 'timepicker'
}

export type ProcessorParamsConfig<T = Record<string, any>> = Pick<
ProcessorParamComponentProps<T>,
 'name' | 'description' | 'required' | 'validate' |
  'ComponentProps' | 'props' | 'rules'
 > & {type: ProcessorParamTypes}

export type Processor<T, ConfigType=Record<string, any>> = BaseProcessorData<T> & {
    paramsConfig: ProcessorParamsConfig<ConfigType>[];
    processorTypeDisplayName: string
    displayNameTemplate?: string
}
