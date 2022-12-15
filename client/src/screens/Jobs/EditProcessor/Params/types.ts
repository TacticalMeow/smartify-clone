// eslint-disable-next-line import/no-extraneous-dependencies
import { Mark } from '@mui/base';
import { HTMLInputTypeAttribute } from 'react';
import { Control, RegisterOptions } from 'react-hook-form';

export type SliderParamProps = {
    steps: number
    min: number,
    max: number,
    marks?: Mark[],
}

export type SelectParamProps = {
    items: string[],
    multiple?: boolean,
    resolveLabel?: (value?: string) => string,
    resolveValue?: (value?: string) => string
}

export type ProcessorParamComponentProps<T = Record<string, any>> = {
    name: string,
    label: string,
    required: boolean,
    description?: string,
    defaultValue: any,
    control: Control,
    validate?: (value: any) => string | boolean,
    ComponentProps?: any
    props?: T,
    type?: HTMLInputTypeAttribute
    rules?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
}
