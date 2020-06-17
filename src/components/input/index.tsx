import React, { FC, PropsWithChildren, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MultiDataChildren, MultiDataManager, MultiDataSet, PickerModal, PickerService, PickerValues } from '../picker';
import './style.scss';
import { FormInstance } from 'rc-field-form';
import { DateTimeManager } from '../../common/utils/date';

interface InputSharedProps extends PropsWithChildren<any> {
  value?: any;
  onChange?: (value: any) => void;
  placeholder?: string;
  form?: FormInstance;
  required?: boolean;
  name?: string;
  errors?: string[];
}
interface Props extends InputSharedProps {
  type?: 'text';
}
interface InputPickerOption extends InputSharedProps {
  type: 'picker';
  data: MultiDataSet | MultiDataChildren;
  multi?: number;
  title?: string | ReactNode;
}
interface InputDateTimePickerOption extends InputSharedProps {
  type: 'dateTime';
  column?: number;
  title?: string | ReactNode;
  value?: Date | string;
}
type InputProps = Props | InputPickerOption | InputDateTimePickerOption;
const defaultProps: InputProps = {
  type: 'text'
};
const Input: FC<InputProps> = function(props): JSX.Element {
  const { type, data, onChange, value, placeholder, multi, errors, title, column } = props;
  const [optErrors, setOptErrors] = useState<string[] | undefined>();

  const input = useMemo(() => {
    switch (type) {
      case 'text':
        return (<input type="text" placeholder={placeholder} onChange={onChange} value={value || ''} />);
      case 'picker':
        return (<PickerInput data={data} onChange={onChange} value={value} placeholder={placeholder} multi={multi} title={title} />);
      case 'dateTime':
        return (<DateTimePicker column={column} title={title} placeholder={placeholder} onChange={onChange} />);
      default:
        return (<input type={type} placeholder={placeholder} value={value || ''} onChange={onChange} />);
    }
  }, [type, data, onChange, value, placeholder, multi, title, column]);

  useEffect(() => {
    setOptErrors(errors);
  }, [errors]);

  return (
    <div className={'windy-input-wrapper'}>{input}{optErrors}</div>
  );

};
Input.defaultProps = defaultProps;
export { Input };

/*
* Picker Input
*/
interface PickerInputProps extends InputSharedProps {
  data: MultiDataSet | MultiDataChildren;
  value?: PickerValues;
  multi?: number;
  title?: string | ReactNode;
  onChange?(value: PickerValues): void;
  wrapperClassName?: string;
  formatNames?: (values: MultiDataChildren) => string;
}
const PickerInput: FC<PickerInputProps> = function(props): JSX.Element {
  const { data, value = '', onChange, placeholder, multi = 1, title, wrapperClassName, formatNames } = props;
  const pickerServiceRef = useRef<PickerService>(new PickerService());
  const pickerModalRef = useRef<PickerModal>();
  const [currentValue, setCurrentValue] = useState<string>('');
  const dataManager = useMemo(() => {
    return new MultiDataManager(multi);
  }, [multi]);

  const emitChange = useCallback(() => {
    let emitValue: string | number | Array<string | number> = '';
    if (multi === 1 && dataManager.values.length) {
      emitValue = dataManager.values[0];
    } else if (multi > 1) {
      emitValue = dataManager.values;
    }
    if (typeof onChange === 'function') {
      onChange(emitValue);
    }
  }, [multi, onChange, dataManager]);
  // echo input
  const echoDisplay = useCallback((value: (string | number)[]) => {
    dataManager.setValues(value);
    let valueNames: string;
    if (typeof formatNames === 'function') {
      valueNames = formatNames(dataManager.sourceValues);
    } else {
      valueNames = dataManager.sourceValues.map(item => item.name).join(' ');
    }
    setCurrentValue(valueNames);
    emitChange();
  }, [emitChange, dataManager, formatNames]);
  // echo picker
  const echoPicker = useCallback((data: MultiDataSet | MultiDataChildren, value?: PickerValues) => {
    pickerModalRef.current?.setData(data);
    pickerModalRef.current?.setValue(value);

    dataManager.setData(data);
    dataManager.setValues(value);
    let valueNames: string;
    if (typeof formatNames === 'function') {
      valueNames = formatNames(dataManager.sourceValues);
    } else {
      valueNames = dataManager.sourceValues.map(item => item.name).join(' ');
    }
    setCurrentValue(valueNames);
  }, [dataManager, formatNames]);
  const showPicker = useCallback(() => {
    pickerServiceRef.current.open({
      title,
      data: dataManager.sources,
      defaultValue: dataManager.values,
      wrapperClassName,
      multi,
      callback: (modal) => {
        pickerModalRef.current = modal;
      }
    }).then(res => {
      pickerModalRef.current = undefined;
      if (typeof res !== 'undefined') {
        echoDisplay(res);
      }
    });
  }, [echoDisplay, multi, dataManager, title, wrapperClassName]);
  useEffect(() => {
    echoPicker(data, value);
  }, [data, value, echoPicker]);

  return (
    <input type="text" onClick={showPicker} placeholder={placeholder} value={currentValue} readOnly={true} />
  );
};
export { PickerInput };

/*
* DateTimePicker
*/
interface DateTimePickerProps extends InputSharedProps {
  start?: Date;
  end?: Date;
  column?: number;
  title?: string | ReactNode;
  value?: Date | string;
  onChange?: (value: Date) => void;
}
const DateTimePicker: FC<DateTimePickerProps> = function(props): JSX.Element {
  const defaultStart = useMemo<Date>(() => {
    return new Date(new Date().getFullYear() - 10, 0, 1);
  }, []);
  const defaultEnd = useMemo(() => {
    return new Date(new Date().getFullYear() + 10, 11, 31, 23, 59, 59);
  }, []);
  const dateManager = useRef<DateTimeManager>(new DateTimeManager());

  const { start = defaultStart, end = defaultEnd, column = 5, placeholder, onChange, value, title } = props;
  const [data, setData] = useState<MultiDataChildren>([]);
  /* init data */
  useEffect(() => {
    dateManager.current.setRange(start, end, column);
    setData(dateManager.current.dataSet);
  }, [start, end, column]);

  /* value */
  const [realValue, setRealValue] = useState<PickerValues>([]);
  useEffect(() => {
    let date: Date;
    if (value instanceof Date) {
      date = value;
    } else if (typeof value === 'string') {
      date = new Date(value);
    } else {
      date = new Date();
    }
    setRealValue([
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    ]);
  }, [value]);

  const valuesToDate = useCallback((values: PickerValues) => {
    let date: Date;
    if (!Array.isArray(values)) {
      values = [values];
    }
    if (values.length > 1 && values.length < 7) {
      const args: [number, number, number?, number?, number?, number?] = values.slice(0) as any;
      args[1] -= 1;
      date = new Date(...args);
    } else if (values.length === 1) {
      date = new Date(String(values[0]));
    } else {
      date = new Date();
    }
    return date;
  }, []);

  /* handle change */
  const handleChange = useCallback((values: PickerValues) => {
    const date = valuesToDate(values);
    if (typeof onChange === 'function') {
      onChange(date);
    }
  }, [onChange, valuesToDate]);

  /* format names */
  const formatNames = useCallback((values: MultiDataChildren) => {
    return valuesToDate(values.map(item => item.value)).toLocaleString();
  }, [valuesToDate]);

  return (
    <PickerInput
      data={data}
      multi={column}
      placeholder={placeholder}
      onChange={handleChange}
      value={realValue}
      wrapperClassName={'date-time-picker'}
      formatNames={formatNames}
      title={title}
    />
  );
};
export { DateTimePicker };
