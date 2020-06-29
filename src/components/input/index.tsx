import React, { FC, PropsWithChildren, ReactNode, useEffect } from 'react';
import './style.scss';
import { PickerInput, PickerInputInstance, SelectorInput } from './picker-input';
import { DateTimePicker, DateTimePickerProps, TimePicker, TimePickerProps } from './date-time-input';
import { MultiDataChildren, MultiDataSet } from '../picker/core';

interface InputSharedProps extends PropsWithChildren<any> {
  value?: any;
  onChange?: (value: any) => void;
  placeholder?: string;
  hasArrow?: (arrow: boolean) => void;
  picker?: PickerInputInstance;
}
interface InputNormalProps extends InputSharedProps {
  type?: 'text';
}
interface InputPickerOption extends InputSharedProps {
  type: 'picker';
  data: MultiDataSet | MultiDataChildren;
  multi?: number;
  title?: string | ReactNode;
}
type InputDateTimePicker = InputSharedProps & DateTimePickerProps;
interface InputDateTimePickerOption extends InputDateTimePicker {
  type: 'dateTime';
}
type InputTimePicker = InputSharedProps & TimePickerProps;
interface InputTimePickerOption extends InputTimePicker {
  type: 'time';
}
interface InputSelectorOption extends InputSharedProps {
  type: 'selector';
  data: MultiDataSet | MultiDataChildren;
  column?: number;
}

type InputProps = InputNormalProps | InputPickerOption | InputDateTimePickerOption | InputTimePickerOption | InputSelectorOption;
const Input: FC<InputProps> = function(props): JSX.Element {
  const { type = 'text', data, onChange, value, placeholder, multi, title, column, start, end, hasArrow, picker } = props;

  useEffect(() => {
    if (typeof hasArrow === 'function') {
      hasArrow(['picker', 'dateTime', 'time', 'selector'].includes(type));
    }
  }, [hasArrow, type]);

  switch (type) {
    case 'text':
      return (<input type="text" className={'y-input'} placeholder={placeholder} onChange={onChange} value={value || ''} />);
    case 'picker':
      return (<PickerInput data={data} onChange={onChange} value={value} placeholder={placeholder} multi={multi} title={title} picker={picker} />);
    case 'dateTime':
      return (<DateTimePicker column={column} title={title} placeholder={placeholder} onChange={onChange} start={start} end={end} picker={picker} />);
    case 'time':
      return (<TimePicker start={start} end={end} onChange={onChange} value={value} column={column} title={title} placeholder={placeholder} picker={picker} />);
    case 'selector':
      return (<SelectorInput placeholder={placeholder} picker={picker} value={value} onChange={onChange} data={data} column={column} />);
    default:
      return (<input className={'y-input'} type={type} placeholder={placeholder} value={value || ''} onChange={onChange} />);
  }

};
export { Input };
