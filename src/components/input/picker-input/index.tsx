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
  title?: ReactNode;
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
const PickerInput: FC<PickerInputProps> = function(props) {
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
    <input className={'y-input'} type="text" onClick={showPicker} placeholder={placeholder} value={currentValue} readOnly={true} />
  );
};
export { PickerInput };

/*
* Selector Input
*/
export interface SelectorInputProps {
  placeholder?: PickerInputProps['placeholder'];
  value?: PickerInputProps['value'];
  picker?: PickerInputInstance;
  onChange?: PickerInputProps['onChange'];
  data: PickerInputProps['data'];
  column?: number;
  formatNames?: PickerInputProps['formatNames'];
  title?: PickerInputProps['title'];
}
const SelectorInput: FC<SelectorInputProps> = function(props) {
  const { placeholder, picker, data, value, column = 3, formatNames, onChange, title } = props;

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
        selector.open(data, selector.dataManager.values, title).then(res => {
          echoDisplay(res);
        });
      }
    };
  }, [data, selector, echoDisplay, title]);

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
    <input className={'y-input'} type="text" onClick={showSelector} placeholder={placeholder} value={currentValue} readOnly={true} />
  );
};
export { SelectorInput };
