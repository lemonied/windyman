import React, { FC, PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import { MultiPickerDataItem, PickerModal, PickerService } from '../picker';

interface InputSharedProps extends PropsWithChildren<any> {
  value?: any;
  onChange?: (value: any) => void;
  placeholder?: string;
}
interface Props extends InputSharedProps {
  type?: 'text';
}
interface InputPickerOption extends InputSharedProps {
  type: 'picker'
  data: MultiPickerDataItem[];
}
const defaultProps: Props | InputPickerOption = {
  type: 'text'
};
const Input: FC<Props | InputPickerOption> = function(props): JSX.Element {
  const { type, data, onChange, value, placeholder } = props;

  switch (type) {
    case 'text':
      return (<input type="text" placeholder={placeholder} />);
    case 'picker':
      return (<PickerInput data={data} onChange={onChange} value={value} placeholder={placeholder} />);
    default:
      return (<input type={type} placeholder={placeholder} />);
  }
};
Input.defaultProps = defaultProps;
export { Input };

interface PickerInputProps extends InputSharedProps {
  data: MultiPickerDataItem[];
  value?: string | number;
  onChange?(value: string | number): void;
}
const PickerInput: FC<PickerInputProps> = function(props): JSX.Element {
  const { data, value, onChange, placeholder } = props;
  const defaultDataRef = useRef<MultiPickerDataItem[]>(data);
  const defaultValRef = useRef<string | number | undefined>(value);
  const pickerServiceRef = useRef<PickerService>(new PickerService());
  const pickerModalRef = useRef<PickerModal>();
  const [currentValue, setCurrentValue] = useState<MultiPickerDataItem | null>(null);

  // echo input
  const echoDisplay = useCallback((value?: string | number) => {
    const data = defaultDataRef.current;
    const index = data.findIndex(item => item.value === value);
    let emitValue: string | number;
    if (index > -1) {
      setCurrentValue(data[index]);
      emitValue = data[index].value;
    } else {
      setCurrentValue(null);
      emitValue = '';
    }
    if (defaultValRef.current !== emitValue) {
      defaultValRef.current = emitValue;
      if (typeof onChange === 'function') {
        onChange(emitValue);
      }
    }
  }, [onChange]);
  // echo picker
  const echoPicker = useCallback((data: MultiPickerDataItem[], value?: string | number) => {
    pickerModalRef.current?.setData(data);
    defaultDataRef.current = data;
    const index = data.findIndex(item => item.value === value);
    if (index > -1) {
      pickerModalRef.current?.setValue(value);
      defaultValRef.current = value;
      setCurrentValue(data[index]);
    } else {
      pickerModalRef.current?.setValue();
      setCurrentValue(null);
    }
  }, []);
  const showPicker = useCallback(() => {
    pickerServiceRef.current.open(defaultDataRef.current, defaultValRef.current, (modal) => {
      pickerModalRef.current = modal;
    }).subscribe(res => {
      pickerModalRef.current = undefined;
      if (typeof res !== 'undefined') {
        echoDisplay(res);
      }
    });
  }, [echoDisplay]);
  useEffect(() => {
    echoPicker(data, value);
  }, [data, value, echoPicker]);

  return (
    <input type="text" onClick={showPicker} placeholder={placeholder} value={currentValue?.name || ''} readOnly={true} />
  );
};
export { PickerInput };
