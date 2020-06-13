import React, { Component, FC, PropsWithChildren, useEffect, useRef, createRef, RefObject } from 'react';
import ReactDOM from 'react-dom';
import './style.scss';
import { BScroll } from '../better-scroll';
import { combineClassNames } from '../../common/utils';
import { CSSTransition } from 'react-transition-group';
import { Observable } from 'rxjs';

interface Item {
  name: string | number;
  value: string | number;
  disabled?: boolean;
  [prop: string]: any;
}
interface PickerInstance {
  wheelTo(index: number): void;
  getSelectedIndex(): number;
  refresh(): void;
}
interface Props extends PropsWithChildren<any> {
  data: Item[];
  defaultSelectedIndex?: number;
  getInstance?(instance: PickerInstance): void;
  picker?: { [prop: string]: any };
  className?: string;
  onChange?: (index: number) => void;
}
const defaultProps: Props = {
  data: [],
  defaultSelectedIndex: 0
};
// Picker Hook
export const usePicker = (): PickerInstance => {
  const instance = useRef<PickerInstance>({} as PickerInstance);
  return instance.current;
};
const Picker: FC<Props> = function(props): JSX.Element {
  const { data, getInstance, defaultSelectedIndex = 0, picker, className, onChange } = props;
  const wheelWrapperRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<BScroll>();
  const instanceRef = useRef<PickerInstance>();
  const defaultSelectedIndexRef = useRef<number>(defaultSelectedIndex);

  useEffect(() => {
    const instance = instanceRef.current = {
      wheelTo(index: number) {
        scrollRef.current?.wheelTo(index);
      },
      getSelectedIndex() {
        return scrollRef.current?.getSelectedIndex() || 0;
      },
      refresh() {
        scrollRef.current?.refresh();
      }
    };
    if (typeof getInstance === 'function') {
      getInstance(instance);
    }
    if (picker && typeof picker === 'object') {
      Object.assign(picker, instance);
    }
  }, [getInstance, picker]);
  useEffect(() => {
    const scroll = scrollRef.current = new BScroll(wheelWrapperRef.current as Element, {
      wheel:{
        selectedIndex: defaultSelectedIndexRef.current,
        rotate: 25,
        adjustTime: 400,
        wheelWrapperClass: 'wheel-scroll',
        wheelItemClass: 'wheel-item',
        wheelDisabledItemClass: 'wheel-disabled-item'
      } as any,
      probeType: 3
    });
    return () => {
      scroll.destroy();
    };
  }, []);
  useEffect(() => {
    instanceRef.current?.refresh();
    instanceRef.current?.wheelTo(defaultSelectedIndex);
  }, [data, defaultSelectedIndex]);
  useEffect(() => {
    const listen = () => {
      if (typeof onChange === 'function') {
        onChange(scrollRef.current?.getSelectedIndex() || 0);
      }
    };
    scrollRef.current?.on('scrollEnd', listen);
    return () => {
      scrollRef.current?.off('scrollEnd', listen);
    };
  }, [onChange]);

  return (
    <div ref={wheelWrapperRef} className={combineClassNames('windy-wheel-wrapper', className)}>
      <ul className={'wheel-scroll'}>
        {
          data.map(item => (
            <li
              key={item.value}
              className={combineClassNames('wheel-item', item.disabled ? 'wheel-disabled-item' : null)}
            >{ item.name }</li>
          ))
        }
      </ul>
    </div>
  );
};
Picker.defaultProps = defaultProps;

export { Picker };

export interface MultiPickerDataItem extends Item {
  children?: this[];
}
export type PickerValues = string | number | (string | number)[];
interface PickerModalProps extends PropsWithChildren<any> {
  data: MultiPickerDataItem[];
  defaultValue?: PickerValues;
  multi?: number;
  onSubmit?(value?: PickerValues): void;
}
interface PickerModalState {
  show: boolean;
  data: MultiPickerDataItem[][];
  selectedIndex: number[];
}

export class PickerModal extends Component<PickerModalProps, PickerModalState> {
  readonly state: PickerModalState = {
    show: false,
    data: [],
    selectedIndex: []
  }
  static defaultProps = {
    data: [],
    multi: 1
  }
  dataSet: MultiPickerDataItem[][] = [];
  values: (string | number)[] = [];
  dataManager: MultiDataManager = new MultiDataManager(this.props.multi);
  sourceValues: MultiPickerDataItem[] = [];
  picker: PickerInstance[] = [];
  preventClick(e: any) {
    e.preventDefault();
    e.stopPropagation();
  }
  hide() {
    this.setState({ show: false });
  }
  show() {
    this.setState({ show: true });
  }
  getPickerInstance(instance: PickerInstance, index: number) {
    if (this.picker[index]) {
      this.picker[index] = instance;
    } else {
      this.picker.push(instance);
    }
  }
  onChange(index: number, key: number) {
    if (this.dataSet[key] && this.dataSet[key][index]) {
      this.values[key] = this.dataSet[key][index].value;
    }
    this.setValue(
      this.values
    );
  }
  setValue(values?: PickerValues) {
    this.dataManager.setValues(values);
    this.setState({
      data: this.dataManager.dataSet,
      selectedIndex: this.dataManager.selectedIndex
    });
    this.dataSet = this.dataManager.dataSet;
    this.values = this.dataManager.values;
    this.sourceValues = this.dataManager.sourceValues;
  }
  setData(data: MultiPickerDataItem[]) {
    this.dataManager.setData(data);
    this.setState({ data: this.dataManager.dataSet });
    this.dataSet = this.dataManager.dataSet;
  }
  onSave(save: boolean) {
    const { onSubmit } = this.props;
    const { data } = this.state;
    if (onSubmit) {
      if (save) {
        this.dataManager.setIndex(
          data.map((item, key) => Math.max(this.picker[key]?.getSelectedIndex(), 0))
        );
        this.values = this.dataManager.values;
        this.sourceValues = this.dataManager.sourceValues;
        onSubmit(this.values);
      } else {
        onSubmit();
      }
    }
    this.hide();
  }
  componentDidMount() {
    const { data, defaultValue } = this.props;
    this.setData(data);
    this.setValue(defaultValue);
  }

  render() {
    const { show, data, selectedIndex } = this.state;
    return (
      <CSSTransition
        in={show}
        classNames={{
          enter: 'picker-enter',
          enterActive: 'picker-enter-active',
          exit: 'picker-exit',
          exitActive: 'picker-exit-active',
          exitDone: 'picker-exit-done'
        }}
        timeout={300}
      >
        <div className={'windy-picker-modal-mask'} onClick={e => this.onSave(false)}>
          <div className={'picker-modal'} onClick={this.preventClick}>
            <div className={'picker-actions'}>
              <span className={'cancel'} onClick={e => this.onSave(false)}>取消</span>
              <span className={'submit'} onClick={e => this.onSave(true)}>确定</span>
            </div>
            {
              data.map((item, key) => (
                <Picker
                  className={'picker-item'}
                  key={key}
                  data={item}
                  getInstance={e => this.getPickerInstance(e, key)}
                  defaultSelectedIndex={selectedIndex[key]}
                  onChange={e => this.onChange(e, key)}
                />
              ))
            }
          </div>
        </div>
      </CSSTransition>
    );
  }
}

export class MultiDataManager {
  dataSet: MultiPickerDataItem[][] = [];
  sources: MultiPickerDataItem[] = [];
  values: (string | number)[] = [];
  sourceValues: MultiPickerDataItem[] = [];
  selectedIndex: number[] = [];
  multi = 1;
  constructor(multi = 1) {
    this.multi = multi;
  }
  static isArrayEqual(array1: Array<any>, array2: Array<any>): boolean {
    if (array1 === array2) {
      return true;
    }
    const length = Math.max(array1.length, array2.length);
    for (let i = 0; i < length; i++) {
      if (array1[i] !== array2[i]) {
        return false;
      }
    }
    return true;
  }
  static notEmpty(value: PickerValues | undefined): value is PickerValues {
    return typeof value !== 'undefined' && value !== '' && value !== null;
  }
  setData(data?: MultiPickerDataItem[]) {
    if (data) {
      this.sources = data;
    }
    const multi = this.multi;
    const list: MultiPickerDataItem[][] = [];
    const deep = (children: MultiPickerDataItem[], index: number) => {
      list.push(children);
      let value = this.values[index];
      if (typeof value === 'undefined' && children.length) {
        value = children[0].value;
      }
      for (let i = 0; i < children.length; i++) {
        if (
          children[i].value === value &&
          children[i].children?.length &&
          index + 1 < multi
        ) {
          deep(children[i].children as any, index + 1);
          return;
        }
      }
      if (index + 1 < multi && children.length) {
        deep(children[0].children as any, index + 1);
      }
    };
    deep(this.sources, 0);
    this.dataSet = list;
  }
  setValues(values?: PickerValues) {
    let results: (string | number)[] = [];
    if (MultiDataManager.notEmpty(values) && Array.isArray(values)) {
      results = values;
    } else if (MultiDataManager.notEmpty(values) && !Array.isArray(values)) {
      results = [values];
    }
    if (!MultiDataManager.isArrayEqual(this.values, results)) {
      this.values = results;
    }
    this.setData();
    const data = this.dataSet;
    this.sourceValues = [];
    this.selectedIndex = [];
    data.forEach((item, key) => {
      const value = this.values[key];
      const index = item.findIndex(val => val.value === value);
      this.selectedIndex.push(Math.max(0, index));
      if (index > -1) {
        this.sourceValues.push(item[index]);
      }
    });
  }
  setIndex(index: number[]) {
    this.setValues(
      this.dataSet.map((item, key) => {
        const i = index[key];
        if (i && item[i]) {
          return item[i].value;
        }
        return item[0].value;
      })
    );
  }
}

export class PickerService {
  ele: Element[] = [];
  create(
    data: MultiPickerDataItem[],
    defaultValue?: PickerValues,
    multi?: number,
    afterRender?: (container: Element, modal: PickerModal) => void,
    onSubmit?: (value: (string | number)[]) => void
  ): void {
    const pickerModal: RefObject<PickerModal> = createRef<PickerModal>();
    const container = document.createElement('div');
    this.ele.push(container);
    container.className = 'picker-container';
    document.body.appendChild(container);
    ReactDOM.render(<PickerModal multi={multi} data={data} defaultValue={defaultValue} ref={pickerModal} onSubmit={onSubmit} />, container,
      () => {
        if (afterRender && pickerModal.current) {
          afterRender(container, pickerModal.current);
        }
      }
    );
  }
  open(
    data: MultiPickerDataItem[],
    defaultValue?: PickerValues,
    multi?: number,
    callback?: (modal: PickerModal) => void
  ): Observable<any> {
    let container: Element;
    return new Observable(subscriber => {
      this.create(data, defaultValue, multi, (ele, pickerModal) => {
        if (callback) {
          callback(pickerModal);
        }
        container = ele;
        pickerModal.show();
      }, (value?: (string | number)[]) => {
        subscriber.next(value);
        subscriber.complete();
        setTimeout(() => this.destroy(container), 300);
      });
    });
  }
  destroy(ele: Element) {
    ReactDOM.unmountComponentAtNode(ele);
    ele.remove();
    const index = this.ele.indexOf(ele);
    if (index > -1) {
      this.ele.splice(index, 1);
    }
  }
  destroyAll() {
    this.ele.forEach(el => {
      ReactDOM.unmountComponentAtNode(el);
      el.remove();
    });
  }
}
