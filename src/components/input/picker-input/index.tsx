/*
* Picker Input
*/
import { PickerService } from '../../picker';
import React, { CSSProperties, FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MultiDataChildren, MultiDataSet, PickerValues } from '../../picker/core';
import { SelectorService } from '../../selector';

interface PickerSharedProps {
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
  open?: (e?: any) => void;
}
export const usePicker = (): PickerInputInstance => {
  const picker = useRef<PickerInputInstance>({});
  return picker.current;
};
const PickerInput: FC<PickerInputProps> = function(props) {
  const { data, value = '', onChange, placeholder, column = 1, title, wrapperClassName, formatNames, defaultSelectedValues, picker, className, style } = props;
  const [currentValue, setCurrentValue] = useState<string>('');
  const pickerService = useMemo(() => {
    return new PickerService(column);
  }, [column]);

  const emitChange = useCallback(() => {
    let emitValue: string | number | Array<string | number> = '';
    if (column === 1 && pickerService.dataManager.values.length) {
      emitValue = pickerService.dataManager.values[0];
    } else if (column > 1) {
      emitValue = pickerService.dataManager.values;
    }
    if (typeof onChange === 'function') {
      onChange(emitValue);
    }
  }, [column, onChange, pickerService]);
  // Echo Names
  const echoNames = useCallback(() => {
    let valueNames: string;
    if (typeof formatNames === 'function') {
      valueNames = formatNames(pickerService.dataManager.sourceValues);
    } else {
      valueNames = pickerService.dataManager.sourceValues.map(item => item.name).join(' ');
    }
    setCurrentValue(valueNames);
  }, [formatNames, pickerService]);
  // Echo Input
  const echoDisplay = useCallback((value: (string | number)[]) => {
    if (pickerService.pickerModal.current) {
      pickerService.pickerModal.current.setValue(value);
    } else {
      pickerService.dataManager.setValues(value);
    }
    echoNames();
    emitChange();
  }, [emitChange, pickerService, echoNames]);
  // Echo Picker
  const echoPicker = useCallback((data: MultiDataSet | MultiDataChildren, value?: PickerValues) => {
    if (pickerService.pickerModal.current) {
      pickerService.pickerModal.current.setData(data);
      pickerService.pickerModal.current.setValue(value);
    } else {
      pickerService.dataManager.setValues(value);
      pickerService.dataManager.setData(data);
    }
    echoNames();
  }, [pickerService, echoNames]);
  const showPicker = useCallback((e?: any) => {
    e?.stopPropagation();
    e?.preventDefault();
    const defaultValue = !pickerService.dataManager.values.length && defaultSelectedValues ?
      defaultSelectedValues :
      pickerService.dataManager.values;
    pickerService.open({
      title,
      data: data,
      defaultValue,
      wrapperClassName
    }).then(res => {
      if (typeof res !== 'undefined') {
        echoDisplay(res);
      }
    });
  }, [echoDisplay, pickerService, title, wrapperClassName, defaultSelectedValues, data]);
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
  const selector = useMemo(() => {
    return new SelectorService(column);
  }, [column]);

  // Emit Change
  const emitChange = useCallback(() => {
    if (typeof onChange !== 'undefined') {
      onChange(selector.dataManager.values);
    }
  }, [onChange, selector]);
  // Echo Names
  const echoNames = useCallback(() => {
    let names: string = '';
    if (typeof formatNames === 'function') {
      names = formatNames(selector.dataManager.sourceValues);
    } else {
      names = selector.dataManager.sourceValues.map(item => item.name).join(' ');
    }
    setCurrentValue(names);
  }, [formatNames, selector]);
  // Echo Input
  const echoDisplay = useCallback((value: (string | number)[]) => {
    if (selector.ref.current) {
      selector.ref.current.setValue(value);
    } else {
      selector.dataManager.setValues(value);
    }
    echoNames();
    emitChange();
  }, [selector, echoNames, emitChange]);
  const echoSelector = useCallback((data: MultiDataChildren | MultiDataSet, values?: PickerValues) => {
    if (selector.ref.current) {
      selector.ref.current.setData(data);
      selector.ref.current.setValue(values);
    } else {
      selector.dataManager.setData(data);
      selector.dataManager.setValues(values);
    }
    echoNames();
  }, [selector, echoNames]);

  const instance = useMemo<PickerInputInstance>(() => {

    return {
      open() {
        selector.open({
          data,
          defaultValue: selector.dataManager.values,
          title,
          wrapperClassName
        }).then(res => {
          echoDisplay(res);
        });
      }
    };
  }, [data, selector, echoDisplay, title, wrapperClassName]);

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
