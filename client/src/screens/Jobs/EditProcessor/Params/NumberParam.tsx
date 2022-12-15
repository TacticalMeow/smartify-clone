import React from 'react';
import TextParam from 'screens/Jobs/EditProcessor/Params/TextParam';
import { ProcessorParamComponentProps } from 'screens/Jobs/EditProcessor/Params/types';

const NumberParam = (props: ProcessorParamComponentProps) => <TextParam {...props} type="number" />;

export default NumberParam;
