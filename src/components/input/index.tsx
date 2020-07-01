import React, { FC, useCallback, useEffect, useState } from 'react';
import './style.scss';
import { PickerInput, PickerInputInstance, PickerInputProps, SelectorInput, SelectorInputProps } from './picker-input';
import { DateTimePicker, DateTimePickerProps, TimePicker, TimePickerProps } from './date-time-input';
import { Icon } from '../icon';

type ExtendsWith<A = {}, B = {}, C = {}> = A & B & C;
interface InputSharedProps extends ExtendsWith<any>{
  value?: any;
  onChange?: (value: any) => void;
  placeholder?: string;
  hasArrow?: (arrow: boolean) => void;
  picker?: PickerInputInstance;
}
interface InputNormalProps extends ExtendsWith<InputSharedProps> {
  type?: 'text' | 'password';
}
interface InputPickerOption extends ExtendsWith<InputSharedProps, PickerInputProps> {
  type: 'picker';
}
interface InputDateTimePickerOption extends ExtendsWith<InputSharedProps, DateTimePickerProps> {
  type: 'dateTime';
}
interface InputTimePickerOption extends ExtendsWith<InputSharedProps, TimePickerProps> {
  type: 'time';
}
interface InputSelectorOption extends ExtendsWith<InputSharedProps, SelectorInputProps> {
  type: 'selector';
}

type InputProps = InputNormalProps | InputPickerOption | InputDateTimePickerOption | InputTimePickerOption | InputSelectorOption;
const Input: FC<InputProps> = function(props) {
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
      return (<SelectorInput placeholder={placeholder} picker={picker} value={value} onChange={onChange} data={data} column={column} title={title} />);
    case 'password':
      return (<InputPassword value={value} onChange={onChange} placeholder={placeholder} />);
    default:
      return (<input className={'y-input'} type={type} placeholder={placeholder} value={value || ''} onChange={onChange} />);
  }

};
export { Input };

const InputPassword: FC<InputSharedProps> = function(props) {
  const { onChange, placeholder, value = '' } = props;

  const [ visible, setVisible ] = useState<boolean>(false);
  const onClick = useCallback((e: any) => {
    e.stopPropagation();
    e.preventDefault();
    setVisible(v => !v);
  }, []);

  return (
    <span className={'windy-password-input-wrapper'}>
      <input type={visible ? 'text' : 'password'} onChange={onChange} placeholder={placeholder} value={value} className={'y-input'} />
      <Icon type={visible ? 'eye-invisible' : 'eye'} onClick={onClick} className={'windy-password-icon'} />
    </span>
  );
};
