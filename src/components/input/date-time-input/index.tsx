/*
* DateTimePicker
*/
import React, { FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { dateFormat, DateTimeManager, TimeManager } from '../date';
import { PickerInput, PickerInputInstance } from '../picker-input';
import { MultiDataChildren, PickerValues } from '../../picker/core';

export interface DateTimePickerProps {
  start?: Date;
  end?: Date;
  column?: number;
  title?: ReactNode;
  value?: Date | string;
  onChange?: (value: Date) => void;
  placeholder?: string;
  picker?: PickerInputInstance;
}
const DateTimePicker: FC<DateTimePickerProps> = function(props) {
  const defaultStart = useMemo<Date>(() => {
    return new Date(new Date().getFullYear() - 10, 0, 1);
  }, []);
  const defaultEnd = useMemo(() => {
    return new Date(new Date().getFullYear() + 10, 11, 31, 23, 59, 59);
  }, []);
  const dateManager = useRef<DateTimeManager>(new DateTimeManager());

  const { start = defaultStart, end = defaultEnd, column = 5, placeholder, onChange, value, title, picker } = props;
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
      return setRealValue([]);
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
      date = new Date(values[0] as number, 0, 1);
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
    if (values.length) {
      const date = valuesToDate(values.map(item => item.value));
      return dateFormat(date, 'yyyy-MM-dd hh:mm:ss');
    }
    return '';
  }, [valuesToDate]);

  const defaultSelectedValue = useMemo(() => {
    const now = new Date();
    return [
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    ];
  }, []);

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
      defaultSelectedValues={defaultSelectedValue}
      picker={picker}
    />
  );
};
export { DateTimePicker };

/*
* Time Picker
* value: string = xx:xx:xx
*/
export interface TimePickerProps {
  /* example 20:08:53 */
  start?: string;
  end?: string;
  onChange?: (value: string) => void;
  value?: string;
  title?: ReactNode;
  column?: 1 | 2 | 3;
  placeholder?: string;
  picker?: PickerInputInstance;
}
const TimePicker: FC<TimePickerProps> = (props) => {
  const { start, end, onChange, value, title, column = 3, placeholder, picker } = props;
  const [data, setData] = useState<MultiDataChildren>([]);
  const [realValue, setRealValue] = useState<PickerValues>([]);
  const defaultStart = useMemo(() => {
    const params = start ? start.split(':').map(item => Number(item)) : [0, 0, 0];
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...params);
  }, [start]);
  const defaultEnd = useMemo(() => {
    const params = end ? end.split(':').map(item => Number(item)) : [23, 59, 59];
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...params);
  }, [end]);
  const timeManager = useRef<TimeManager>(new TimeManager());
  useEffect(() => {
    timeManager.current.setRange(defaultStart, defaultEnd, column);
    setData(timeManager.current.dataSet);
  }, [defaultStart, defaultEnd, column]);
  useEffect(() => {
    setRealValue(value ? value.split(':').map(item => Number(item)) : []);
  }, [value]);
  const handleChange = useCallback((values: PickerValues) => {
    if (!Array.isArray(values)) {
      values = [values];
    }
    if (typeof onChange === 'function') {
      onChange(values.map(item => TimeManager.interZero(Number(item))).join(':'));
    }
  }, [onChange]);
  const defaultSelectedValue = useMemo(() => {
    const now = new Date();
    return [
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    ];
  }, []);
  return (
    <PickerInput
      data={data}
      title={title}
      value={realValue}
      onChange={handleChange}
      multi={column}
      placeholder={placeholder}
      defaultSelectedValues={defaultSelectedValue}
      picker={picker}
    />
  );
};
export { TimePicker };
