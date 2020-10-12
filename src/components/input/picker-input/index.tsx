/*
* Picker Input
*/
import React, { CSSProperties, FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PickerService } from '../../picker';
import { MultiDataChildren, MultiDataSet, PickerValues } from '../../picker/core';
import { SelectorService } from '../../selector';

export interface PickerSharedProps {
  placeholder?: string;
  value?: PickerValues;
  picker?: PickerInputInstance;
  onChange?(value: PickerValues): void;
  data: MultiDataSet | MultiDataChildren;
  column?: number;
  formatNames?: (values: MultiDataChildren) => string;
  title?: ReactNode;
  style?: CSSProperties;
  className?: string;
  wrapperClassName?: string;
}

export interface PickerInputProps extends PickerSharedProps {
  defaultSelectedValues?: PickerValues;
}
export interface PickerInputInstance {
  open?: (e?: React.MouseEvent) => void;
}
export const usePicker = (): PickerInputInstance => {
  const picker = useRef<PickerInputInstance>({});
  return picker.current;
};
const PickerInput: FC<PickerInputProps> = function(props) {
  const { data, value = '', onChange, placeholder, column = 1, title, wrapperClassName, formatNames, defaultSelectedValues, picker, className, style } = props;
  const [currentValue, setCurrentValue] = useState<string>('');
  const pickerServiceRef = useRef<PickerService>(new PickerService(column));

  const emitChange = useCallback(() => {
    let emitValue: string | number | Array<string | number> = '';
    if (column === 1 && pickerServiceRef.current.dataManager.values.length) {
      emitValue = pickerServiceRef.current.dataManager.values[0];
    } else if (column > 1) {
      emitValue = pickerServiceRef.current.dataManager.values;
    }
    if (typeof onChange === 'function') {
      onChange(emitValue);
    }
  }, [column, onChange]);
  // Echo Names
  const echoNames = useCallback(() => {
    let valueNames: string;
    if (typeof formatNames === 'function') {
      valueNames = formatNames(pickerServiceRef.current.dataManager.sourceValues);
    } else {
      valueNames = pickerServiceRef.current.dataManager.sourceValues.map(item => item.name).join(' ');
    }
    setCurrentValue(valueNames);
  }, [formatNames]);
  // Echo Input
  const echoDisplay = useCallback((value: (string | number)[]) => {
    pickerServiceRef.current.setValue(value);
    echoNames();
    emitChange();
  }, [emitChange, echoNames]);
  // Echo Picker
  const echoPicker = useCallback((data: MultiDataSet | MultiDataChildren, value?: PickerValues) => {
    pickerServiceRef.current.setData(data);
    pickerServiceRef.current.setValue(value);
    echoNames();
  }, [echoNames]);
  const showPicker = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    const defaultValue = !pickerServiceRef.current.dataManager.values.length && defaultSelectedValues ?
      defaultSelectedValues :
      pickerServiceRef.current.dataManager.values;
    pickerServiceRef.current.open({
      title,
      data: data,
      defaultValue,
      wrapperClassName
    }).then(res => {
      if (typeof res !== 'undefined') {
        echoDisplay(res);
      }
    });
  }, [echoDisplay, title, wrapperClassName, defaultSelectedValues, data]);

  useEffect(() => {
    echoPicker(data, value);
  }, [data, value, echoPicker]);
  useEffect(() => {
    if (picker) {
      Object.assign(picker, {
        open: showPicker
      });
    }
  }, [picker, showPicker]);
  useEffect(() => {
    const pickerService = pickerServiceRef.current;
    return () => {
      pickerService.destroy();
    };
  }, []);
  return (
    <input style={style} className={className} type="text" onClick={showPicker} placeholder={placeholder} value={currentValue} readOnly={true} />
  );
};
export { PickerInput };

/*
* Selector Input
*/
export interface SelectorInputProps extends PickerSharedProps { }
const SelectorInput: FC<SelectorInputProps> = function(props) {
  const { placeholder, picker, data, value, column = 3, formatNames, onChange, title, style, className, wrapperClassName } = props;

  const [currentValue, setCurrentValue] = useState<string>('');
  const selectorRef = useRef<SelectorService>(new SelectorService(column));

  // Emit Change
  const emitChange = useCallback(() => {
    if (typeof onChange !== 'undefined') {
      onChange(selectorRef.current.dataManager.values);
    }
  }, [onChange]);
  // Echo Names
  const echoNames = useCallback(() => {
    let names: string = '';
    if (typeof formatNames === 'function') {
      names = formatNames(selectorRef.current.dataManager.sourceValues);
    } else {
      names = selectorRef.current.dataManager.sourceValues.map(item => item.name).join(' ');
    }
    setCurrentValue(names);
  }, [formatNames]);
  // Echo Input
  const echoDisplay = useCallback((value: (string | number)[]) => {
    selectorRef.current.setValue(value);
    echoNames();
    emitChange();
  }, [echoNames, emitChange]);
  const echoSelector = useCallback((data: MultiDataChildren | MultiDataSet, values?: PickerValues) => {
    selectorRef.current.setData(data);
    selectorRef.current.setValue(values);
    echoNames();
  }, [echoNames]);

  const instance = useMemo<PickerInputInstance>(() => {

    return {
      open() {
        selectorRef.current.open({
          data,
          defaultValue: selectorRef.current.dataManager.values,
          title,
          wrapperClassName
        }).then(res => {
          echoDisplay(res);
        });
      }
    };
  }, [data, echoDisplay, title, wrapperClassName]);

  const showSelector = useCallback((e?: any) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (instance.open) {
      instance.open();
    }
  }, [instance]);

  useEffect(() => {
    if (picker) {
      Object.assign(picker, instance);
    }
  }, [picker, instance]);
  useEffect(() => {
    echoSelector(data, value);
  }, [data, value, echoSelector]);
  useEffect(() => {
    const selector = selectorRef.current;
    return () => {
      selector.destroy();
    };
  }, []);

  return (
    <input
      style={style}
      className={className}
      type="text"
      onClick={showSelector}
      placeholder={placeholder}
      value={currentValue}
      readOnly={true}
    />
  );
};
export { SelectorInput };
