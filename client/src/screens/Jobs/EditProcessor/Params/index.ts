import NumberParam from 'screens/Jobs/EditProcessor/Params/NumberParam';
import SelectParam from 'screens/Jobs/EditProcessor/Params/SelectParam';
import SliderParam from 'screens/Jobs/EditProcessor/Params/SliderParam';
import TextParam from 'screens/Jobs/EditProcessor/Params/TextParam';
import { ProcessorParamTypes } from 'screens/Jobs/Processors/library/types';
import TimePickerParam from './TimePickerParam';

export const ParamComponentByType = {
  [ProcessorParamTypes.Text]: TextParam,
  [ProcessorParamTypes.Multiline]: TextParam,
  [ProcessorParamTypes.Number]: NumberParam,
  [ProcessorParamTypes.Select]: SelectParam,
  [ProcessorParamTypes.Checkbox]: TextParam,
  [ProcessorParamTypes.Slider]: SliderParam,
  [ProcessorParamTypes.TimePicker]: TimePickerParam,
};
