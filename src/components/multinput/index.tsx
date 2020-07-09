import React, {
  forwardRef,
  ForwardRefRenderFunction,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
import { PickerSharedProps } from '../input/picker-input';
import './style.scss';
import { PickerService } from '../picker';
import { SelectorService } from '../selector';
import { DataItem, MultiDataChildren, MultiDataManager, MultiDataSet } from '../picker/core';
import { deepMerge } from '../../common/utils';
import { Icon } from '../icon';
import { modal } from '../modal';

interface MultinputInstance {
  open?: (e?: React.MouseEvent) => void;
}
interface MultinputProps {
  type?: 'picker' | 'selector';
  hasArrow?: (arrow: boolean) => void;
  value?: (string | number)[][];
  onChange?: (value: (string | number)[][]) => void;
  placeholder?: string;
  column?: number;
  title?: ReactNode;
  data: PickerSharedProps['data'];
  wrapperClassName?: string;
  picker?: PickerSharedProps['picker'];
  formatNames?: (values: DataItem[][]) => ReactNode[];
}
const MultinputFc: ForwardRefRenderFunction<MultinputInstance, MultinputProps> = function(props, ref) {
  const { placeholder, type = 'picker', column = 3, title, data, wrapperClassName, picker, hasArrow, onChange, formatNames, value } = props;

  const [ currentValue, setCurrentValue ] = useState<ReactNode[]>([]);
  const serviceRef = useRef<(PickerService | SelectorService)>(
    type === 'picker' ? new PickerService(column) : new SelectorService(column)
  );
  const valuesRef = useRef<DataItem[][]>([]);
  const currentColumnRef = useRef<number>(value ? value.length : 0);
  const dataManagerRef = useRef<MultiDataManager>(new MultiDataManager(column));

  const disableItem = useCallback(() => {
    valuesRef.current.forEach((item, key) => {
      if (key !== currentColumnRef.current) {
        serviceRef.current.dataManager.disableSomeone(item.map(val => val.value));
      }
    });
  }, []);
  const emitChange = useCallback(() => {
    if (typeof onChange === 'function') {
      onChange(valuesRef.current.map(item => item.map(val => val.value)));
    }
  }, [onChange]);
  // Echo Names
  const echoNames = useCallback(() => {
    let valueNames: ReactNode[];
    if (typeof formatNames === 'function') {
      valueNames = formatNames(valuesRef.current);
    } else {
      valueNames = valuesRef.current.map(item => item.map(val => val.name).join(' '));
    }
    setCurrentValue(valueNames);
  }, [formatNames]);
  // Echo display(onSubmit)
  const echoDisplay = useCallback((value: (string | number)[]) => {
    const dataManager = dataManagerRef.current;
    const values = valuesRef.current;
    const index = currentColumnRef.current;
    dataManager.setValues(value);
    if (index > values.length) {
      values.push(dataManager.sourceValues);
    } else {
      values[index] = dataManager.sourceValues;
    }
    emitChange();
    echoNames();
  }, [emitChange, echoNames]);
  // Echo Picker
  const echoPicker = useCallback((data: MultiDataSet | MultiDataChildren, value?: (string | number)[][]) => {
    serviceRef.current.setData(deepMerge(data));
    dataManagerRef.current.setData(data);
    disableItem();
    if (value) {
      valuesRef.current = [];
      for (let i = 0; i < value.length; i++) {
        dataManagerRef.current.setValues(value[i]);
        valuesRef.current.push(dataManagerRef.current.sourceValues);
      }
    }
    echoNames();
  }, [disableItem, echoNames]);

  const openModal = useCallback((index?: number) => {
    currentColumnRef.current = typeof index === 'undefined' ? valuesRef.current.length : index;
    serviceRef.current.setData(deepMerge(data));
    disableItem();
    serviceRef.current.open({
      title,
      wrapperClassName,
      defaultValue: serviceRef.current.dataManager.values
    }).then(res => {
      if (res) {
        echoDisplay(res);
      }
    });
  }, [data, disableItem, echoDisplay, title, wrapperClassName]);
  const instance = useMemo<MultinputInstance>(() => {
    return {
      open() {
        currentColumnRef.current = valuesRef.current.length;
        openModal();
      }
    };
  }, [openModal]);
  const onClick = useCallback((e: React.MouseEvent, index?: number) => {
    e.stopPropagation();
    e.preventDefault();
    if (typeof index !== 'undefined' && valuesRef.current[index]) {
      serviceRef.current.setValue(valuesRef.current[index].map(item => item.value));
    }
    openModal(index);
  }, [openModal]);
  const onDel = useCallback((e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    e.preventDefault();
    modal.confirm({content: `是否删除 ${currentValue[index]} ?`}).then(res => {
      if (res) {
        echoPicker(
          data,
          valuesRef.current.filter((item, key) => key !== index).map(item => item.map(val => val.value))
        );
      }
    });
  }, [currentValue, echoPicker, data]);

  useEffect(() => {
    echoPicker(data, value);
  }, [data, value, echoPicker]);
  useEffect(() => {
    if (picker) {
      Object.assign(picker, instance);
    }
    if (typeof hasArrow === 'function') {
      hasArrow(true);
    }
  }, [picker, instance, hasArrow]);
  useEffect(() => {
    const service = serviceRef.current;
    return () => {
      service.destroy();
    };
  }, []);

  useImperativeHandle(ref, () => {
    return instance;
  });
  if (currentValue.length) {
    return (
      <ul className={'windy-multinput-list'}>
        {
          currentValue.map((item, key) => (
            <li key={key} className={'windy-multinput-item'} onClick={e => onClick(e, key)}>
              {item}
              <Icon onClick={e => onDel(e, key)} className={'windy-multinput-del'} type={'times'} />
            </li>
          ))
        }
      </ul>
    );
  }
  return (
    <span className={'windy-multinput-placeholder'} onClick={onClick}>{ placeholder }</span>
  );
};

export const Multinput = forwardRef<MultinputInstance, MultinputProps>(MultinputFc);
