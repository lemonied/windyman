/*
* Picker Input
*/
import { PickerService } from '../../picker';
import React, { FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MultiDataChildren, MultiDataSet, PickerValues } from '../../picker/core';
import { SelectorService } from '../../selector';

export interface PickerInputProps {
  data: MultiDataSet | MultiDataChildren;
  value?: PickerValues;
  defaultSelectedValues?: PickerValues;
  multi?: number;
  title?: string | ReactNode;
  onChange?(value: PickerValues): void;
  wrapperClassName?: string;
  formatNames?: (values: MultiDataChildren) => string;
  placeholder?: string;
  picker?: PickerInputInstance;
}
export interface PickerInputInstance {
  open?: (e?: any) => void;
}
export const usePicker = (): PickerInputInstance => {
  const picker = useRef<PickerInputInstance>({});
  return picker.current;
};
const PickerInput: FC<PickerInputProps> = function(props): JSX.Element {
  const { data, value = '', onChange, placeholder, multi = 1, title, wrapperClassName, formatNames, defaultSelectedValues, picker } = props;
  const [currentValue, setCurrentValue] = useState<string>('');
  const pickerService = useMemo(() => {
    return new PickerService(multi);
  }, [multi]);

  const emitChange = useCallback(() => {
    let emitValue: string | number | Array<string | number> = '';
    if (multi === 1 && pickerService.dataManager.values.length) {
      emitValue = pickerService.dataManager.values[0];
    } else if (multi > 1) {
      emitValue = pickerService.dataManager.values;
    }
    if (typeof onChange === 'function') {
      onChange(emitValue);
    }
  }, [multi, onChange, pickerService]);
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
      pickerService.pickerModal.current?.setData(data);
      pickerService.pickerModal.current?.setValue(value);
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
    <input className={'y-input'} type="text" onClick={showPicker} placeholder={placeholder} value={currentValue} readOnly={true} />
  );
};
export { PickerInput };

/*
* Selector Input
*/
export interface SelectorInputProps {
  placeholder?: string;
  value?: PickerValues;
  picker?: PickerInputInstance;
  onChange?(value: PickerValues): void;
  data: MultiDataSet | MultiDataChildren;
  column?: number;
}
const SelectorInput: FC<SelectorInputProps> = function(props) {
  const { placeholder, picker, data, column = 3 } = props;

  const [currentValue] = useState<string>('');
  const selector = useMemo(() => {
    return new SelectorService(column);
  }, [column]);

  const instance = useMemo<PickerInputInstance>(() => {

    return {
      open() {
        selector.open(data);
      }
    };
  }, [data, selector]);
  useEffect(() => {
    if (picker) {
      Object.assign(picker, instance);
    }
  }, [picker, instance]);

  const showSelector = useCallback((e?: any) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (instance.open) {
      instance.open();
    }
  }, [instance]);

  return (
    <input className={'y-input'} type="text" onClick={showSelector} placeholder={placeholder} value={currentValue} readOnly={true} />
  );
};
export { SelectorInput };
