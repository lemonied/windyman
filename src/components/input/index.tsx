import React, { cloneElement, CSSProperties, FC, useCallback, useEffect, useMemo, useState } from 'react';
import './style.scss';
import { PickerInput, PickerInputInstance, PickerInputProps, SelectorInput, SelectorInputProps } from './picker-input';
import { DateTimePicker, DateTimePickerProps, TimePicker, TimePickerProps } from './date-time-input';
import { Icon } from '../icon';
import { combineClassNames } from '../../common/utils';

type ExtendsWith<A = {}, B = {}, C = {}> = A & B & C;
interface InputSharedProps extends ExtendsWith<any>{
  value?: any;
  onChange?: (value: any) => void;
  placeholder?: string;
  hasArrow?: (arrow: boolean) => void;
  picker?: PickerInputInstance;
  className?: string;
  style?: CSSProperties;
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
  const { type = 'text', data, onChange, value, placeholder, title, column, start, end, hasArrow, picker, wrapperClassName, className, style, formatNames } = props;

  useEffect(() => {
    if (typeof hasArrow === 'function') {
      hasArrow(['picker', 'dateTime', 'time', 'selector'].includes(type));
    }
  }, [hasArrow, type]);

  const input = useMemo(() => {
    switch (type) {
      case 'text':
        return (
          <input type="text" value={value || ''} />
        );
      case 'picker':
        return (
          <PickerInput formatNames={formatNames} wrapperClassName={wrapperClassName} data={data} value={value} column={column} title={title} picker={picker}/>
        );
      case 'dateTime':
        return (
          <DateTimePicker value={value} column={column} title={title} start={start} end={end} picker={picker} />
        );
      case 'time':
        return (
          <TimePicker start={start} end={end} value={value} column={column} title={title} picker={picker} />
        );
      case 'selector':
        return (
          <SelectorInput formatNames={formatNames} wrapperClassName={wrapperClassName} picker={picker} value={value} data={data} column={column} title={title}/>
        );
      case 'password':
        return (
          <InputPassword value={value} wrapperClassName={wrapperClassName} />
        );
      default:
        return (
          <input type={type} value={value || ''} />
        );
    }
  }, [column, data, end, picker, start, title, type, value, wrapperClassName, formatNames]);

  return cloneElement(input, {
    className: combineClassNames('y-input', className),
    onChange,
    style,
    placeholder
  });
};
export { Input };

interface InputPassword extends InputSharedProps {
  wrapperClassName?: string;
}
const InputPassword: FC<InputPassword> = function(props) {
  const { onChange, placeholder, value = '', className, style, wrapperClassName } = props;

  const [ visible, setVisible ] = useState<boolean>(false);
  const onClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setVisible(v => !v);
  }, []);

  return (
    <span className={combineClassNames('windy-password-input-wrapper', wrapperClassName)} style={style}>
      <input type={visible ? 'text' : 'password'} onChange={onChange} placeholder={placeholder} value={value} className={className} />
      <Icon type={visible ? 'eye-invisible' : 'eye'} onClick={onClick} className={'windy-password-icon'} />
    </span>
  );
};
