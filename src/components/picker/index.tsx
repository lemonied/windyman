import React, {
  Component,
  useEffect,
  useRef,
  createRef,
  RefObject,
  ReactNode,
  ForwardRefRenderFunction,
  forwardRef,
  useMemo,
  useImperativeHandle
} from 'react';
import ReactDOM from 'react-dom';
import './style.scss';
import BScroll from '@better-scroll/core';
import Wheel from '@better-scroll/wheel';
import { combineClassNames } from '../../common/utils';
import { CSSTransition } from 'react-transition-group';
import { DataItem, MultiDataChildren, MultiDataManager, MultiDataSet, PickerValues } from './core';

BScroll.use(Wheel);

interface PickerInstance {
  wheelTo(index: number): void;
  getSelectedIndex(): number;
  refresh(): void;
}
interface PickerProps {
  data: DataItem[];
  defaultSelectedIndex?: number;
  picker?: { [prop: string]: any };
  className?: string;
  onChange?: (index: number) => void;
}
// Picker Hook
export const usePicker = (): PickerInstance => {
  const instance = useRef<PickerInstance>({} as PickerInstance);
  return instance.current;
};
const PickerFc: ForwardRefRenderFunction<PickerInstance, PickerProps> = function(props, ref) {
  const { data = [], defaultSelectedIndex = 0, picker, className, onChange } = props;
  const wheelWrapperRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<BScroll>();
  const defaultSelectedIndexRef = useRef<number>(defaultSelectedIndex);

  // instance
  const instance = useMemo<PickerInstance>(() => {
    return {
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
  }, []);
  useEffect(() => {
    if (picker && typeof picker === 'object') {
      Object.assign(picker, instance);
    }
  }, [picker, instance]);
  useEffect(() => {
    const scroll = scrollRef.current = new BScroll(wheelWrapperRef.current as HTMLElement, {
      wheel:{
        selectedIndex: defaultSelectedIndexRef.current,
        rotate: 25,
        adjustTime: 400,
        wheelWrapperClass: 'wheel-scroll',
        wheelItemClass: 'wheel-item',
        wheelDisabledItemClass: 'wheel-disabled-item'
      }
    });
    return () => {
      scroll.destroy();
    };
  }, []);
  useEffect(() => {
    instance.refresh();
  }, [data, instance]);
  useEffect(() => {
    instance.wheelTo(defaultSelectedIndex);
  }, [defaultSelectedIndex, instance]);
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
  useImperativeHandle(ref, () => {
    return instance;
  });

  return (
    <div ref={wheelWrapperRef} className={combineClassNames('windy-wheel-wrapper', className)}>
      <ul className={'wheel-scroll'}>
        {
          data.map((item, key) => (
            <li
              key={key}
              className={combineClassNames('wheel-item', item.disabled ? 'wheel-disabled-item' : null)}
            >{ item.name }</li>
          ))
        }
      </ul>
    </div>
  );
};

export const Picker = forwardRef<PickerInstance, PickerProps>(PickerFc);

interface PickerModalProps {
  title?: ReactNode;
  onSubmit?(value?: PickerValues): void;
  wrapperClassName?: string;
  afterClose?: () => void;
  dataManager: MultiDataManager;
}
interface PickerModalState {
  show: boolean;
  data: MultiDataSet;
  selectedIndex: number[];
}
export class PickerModal extends Component<PickerModalProps, PickerModalState> {
  readonly state: PickerModalState = {
    show: false,
    data: [],
    selectedIndex: []
  }
  static defaultProps = {
    data: []
  }
  dataSet: MultiDataSet = [];
  values: (string | number)[] = [];
  dataManager: MultiDataManager;
  sourceValues: MultiDataChildren = [];
  picker: PickerInstance[] = [];
  constructor(props: PickerModalProps) {
    super(props);
    this.dataManager = props.dataManager;
  }
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
  getPickerInstance(instance: PickerInstance | null, index: number) {
    if (!instance) { return; }
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
  setData(data: MultiDataChildren | MultiDataSet) {
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
          data.map((item, key) => Math.max(this.picker[key]?.getSelectedIndex() || 0, 0))
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
  onExited() {
    const { afterClose } = this.props;
    if (afterClose) {
      afterClose();
    }
  }
  componentDidMount() {
    this.setState({
      data: this.dataManager.dataSet,
      selectedIndex: this.dataManager.selectedIndex
    });
    this.dataSet = this.dataManager.dataSet;
    this.values = this.dataManager.values;
    this.sourceValues = this.dataManager.sourceValues;
  }

  render() {
    const { show, data, selectedIndex } = this.state;
    const { title, wrapperClassName } = this.props;
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
        onExited={this.onExited.bind(this)}
      >
        <div className={combineClassNames('windy-picker-modal-mask', wrapperClassName)} onClick={e => this.onSave(false)}>
          <div className={'picker-modal'} onClick={this.preventClick}>
            <div className={'picker-actions'}>
              <span className={'cancel'} onClick={e => this.onSave(false)}>取消</span>
              <span className={'picker-modal-title'}>{ title }</span>
              <span className={'submit'} onClick={e => this.onSave(true)}>确定</span>
            </div>
            {
              data.map((item, key) => (
                <Picker
                  className={'picker-item'}
                  key={key}
                  data={item}
                  ref={e => this.getPickerInstance(e, key)}
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

/*
* class PickerService
*/
export interface PickerServiceOptions {
  data: MultiDataChildren | MultiDataSet;
  defaultValue?: PickerValues;
  title?: ReactNode;
  wrapperClassName?: string;
}
export class PickerService {
  ele: Element | null = null;
  dataManager: MultiDataManager;
  pickerModal: RefObject<PickerModal> = createRef<PickerModal>();
  constructor(multi: number) {
    this.dataManager = new MultiDataManager(multi);
  }
  open(options: PickerServiceOptions): Promise<any> {
    this.destroy();
    return new Promise((resolve, reject) => {
      const {data, defaultValue, title, wrapperClassName} = options;
      const container = document.createElement('div');
      this.ele = container;
      container.className = 'picker-container';
      document.body.appendChild(container);
      this.dataManager.setData(data);
      this.dataManager.setValues(defaultValue);
      ReactDOM.render(
        <PickerModal
          ref={this.pickerModal}
          onSubmit={e => resolve(e)}
          title={title}
          wrapperClassName={wrapperClassName}
          afterClose={() => this.destroy()}
          dataManager={this.dataManager}
        />,
        container,
        () => {
          this.pickerModal.current?.show();
        }
      );
    });
  }
  destroy() {
    this.pickerModal = createRef();
    if (this.ele) {
      ReactDOM.unmountComponentAtNode(this.ele);
      this.ele.remove();
    }
  }
}
