/*
* Picker Input
*/
import { MultiDataChildren, MultiDataManager, MultiDataSet, PickerModal, PickerService, PickerValues } from '../../picker';
import React, { FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
  const picker = useRef<PickerInputInstance>({} as PickerInputInstance);
  return picker.current;
};
const PickerInput: FC<PickerInputProps> = function(props): JSX.Element {
  const { data, value = '', onChange, placeholder, multi = 1, title, wrapperClassName, formatNames, defaultSelectedValues, picker } = props;
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
  const showPicker = useCallback((e?: any) => {
    e?.stopPropagation();
    e?.preventDefault();
    const defaultValue = !dataManager.values.length && defaultSelectedValues ?
      defaultSelectedValues :
      dataManager.values;
    pickerServiceRef.current.open({
      title,
      data: dataManager.sources,
      defaultValue,
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
  }, [echoDisplay, multi, dataManager, title, wrapperClassName, defaultSelectedValues]);
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
