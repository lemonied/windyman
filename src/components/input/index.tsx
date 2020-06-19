import React, { FC, PropsWithChildren, ReactNode } from 'react';
import { MultiDataChildren, MultiDataSet } from '../picker';
import './style.scss';
import { PickerInput } from './picker-input';
import { DateTimePicker, DateTimePickerProps, TimePicker, TimePickerProps } from './date-time-input';

interface InputSharedProps extends PropsWithChildren<any> {
  value?: any;
  onChange?: (value: any) => void;
  placeholder?: string;
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
  type: 'time'
}

type InputProps = InputNormalProps | InputPickerOption | InputDateTimePickerOption | InputTimePickerOption;
const defaultProps: InputProps = {
  type: 'text'
};
const Input: FC<InputProps> = function(props): JSX.Element {
  const { type, data, onChange, value, placeholder, multi, title, column, start, end } = props;


  switch (type) {
    case 'text':
      return (<input type="text" className={'y-input'} placeholder={placeholder} onChange={onChange} value={value || ''} />);
    case 'picker':
      return (<PickerInput data={data} onChange={onChange} value={value} placeholder={placeholder} multi={multi} title={title} />);
    case 'dateTime':
      return (<DateTimePicker column={column} title={title} placeholder={placeholder} onChange={onChange} start={start} end={end} />);
    case 'time':
      return (<TimePicker start={start} end={end} onChange={onChange} value={value} column={column} title={title} placeholder={placeholder} />);
    default:
      return (<input className={'y-input'} type={type} placeholder={placeholder} value={value || ''} onChange={onChange} />);
  }

};
Input.defaultProps = defaultProps;
export { Input };
