import React, { FC, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MultiDataManager, MultiPickerDataItem, PickerModal, PickerService, PickerValues } from '../picker';
import styles from './style.module.scss';

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
  multi?: number;
}
type InputProps = Props | InputPickerOption;
const defaultProps: InputProps = {
  type: 'text'
};
const Input: FC<InputProps> = function(props): JSX.Element {
  const { type, data, onChange, value, placeholder, multi } = props;

  const input = useMemo(() => {
    switch (type) {
      case 'text':
        return (<input type="text" placeholder={placeholder} />);
      case 'picker':
        return (<PickerInput data={data} onChange={onChange} value={value} placeholder={placeholder} multi={multi} />);
      default:
        return (<input type={type} placeholder={placeholder} />);
    }
  }, [type, data, onChange, value, placeholder, multi]);

  return (
    <div className={styles.wrapper}>{input}</div>
  );

};
Input.defaultProps = defaultProps;
export { Input };

interface PickerInputProps extends InputSharedProps {
  data: MultiPickerDataItem[];
  value?: PickerValues;
  multi?: number;
  onChange?(value: PickerValues): void;
}
const PickerInput: FC<PickerInputProps> = function(props): JSX.Element {
  const { data, value = '', onChange, placeholder, multi = 1 } = props;
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
    setCurrentValue(dataManager.sourceValues.map(item => item.name).join(' '));
    emitChange();
  }, [emitChange, dataManager]);
  // echo picker
  const echoPicker = useCallback((data: MultiPickerDataItem[], value?: PickerValues) => {
    const oldValues = dataManager.values;
    pickerModalRef.current?.setData(data);
    pickerModalRef.current?.setValue(value);

    dataManager.setData(data);
    dataManager.setValues(value);
    setCurrentValue(
      dataManager.sourceValues.map(item => item.name).join(' ')
    );
    if (oldValues !== dataManager.values) {
      emitChange();
    }
  }, [dataManager, emitChange]);
  const showPicker = useCallback(() => {
    pickerServiceRef.current.open(dataManager.sources, dataManager.values, multi, (modal) => {
      pickerModalRef.current = modal;
    }).subscribe(res => {
      pickerModalRef.current = undefined;
      if (typeof res !== 'undefined') {
        echoDisplay(res);
      }
    });
  }, [echoDisplay, multi, dataManager]);
  useEffect(() => {
    echoPicker(data, value);
  }, [data, value, echoPicker]);

  return (
    <input type="text" onClick={showPicker} placeholder={placeholder} value={currentValue} readOnly={true} />
  );
};
export { PickerInput };
