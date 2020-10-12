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
import { Icon } from '../icon';
import { PickerSharedProps } from '../input/picker-input';
import { PickerService } from '../picker';
import { DataItem, MultiDataChildren, MultiDataManager, MultiDataSet } from '../picker/core';
import { SelectorService } from '../selector';
import { modal } from '../modal';
import { deepMerge } from '../../common/utils';
import './style.scss';

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
  maxNum?: number;
}
const MultinputFc: ForwardRefRenderFunction<MultinputInstance, MultinputProps> = function(props, ref) {
  const { placeholder, type = 'picker', column = 3, title, data, wrapperClassName, picker, hasArrow, onChange, formatNames, value, maxNum = 3 } = props;

  const [ currentValue, setCurrentValue ] = useState<ReactNode[]>([]);
  const [ showPlus, setShowPlus ] = useState<boolean>(false);
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
    if (typeof hasArrow === 'function') {
      hasArrow(valuesRef.current.length === 0);
    }
    setShowPlus(valuesRef.current.length < maxNum);
    setCurrentValue(valueNames);
  }, [formatNames, hasArrow, maxNum]);
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
    const oldValue = serviceRef.current.dataManager.values.slice(0);
    oldValue.splice(-1);
    serviceRef.current.setValue(oldValue);
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
        valuesRef.current = valuesRef.current.filter((item, key) => key !== index);
        emitChange();
        echoNames();
      }
    });
  }, [currentValue, emitChange, echoNames]);

  useEffect(() => {
    echoPicker(data, value);
  }, [data, value, echoPicker]);
  useEffect(() => {
    if (picker) {
      Object.assign(picker, instance);
    }
    if (typeof hasArrow === 'function') {
      hasArrow(valuesRef.current.length === 0);
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
              <Icon onClick={e => onDel(e, key)} className={'windy-multinput-del'} type={'close-circle'} />
            </li>
          ))
        }
        {
          showPlus ?
            <li className={'windy-multinput-plus'} onClick={onClick}>
              <Icon type={'plus-circle'} className={'windy-multinput-plus-icon'} />
            </li> :
            null
        }
      </ul>
    );
  }
  return (
    <span className={'windy-multinput-placeholder'} onClick={onClick}>{ placeholder }</span>
  );
};

export const Multinput = forwardRef<MultinputInstance, MultinputProps>(MultinputFc);
