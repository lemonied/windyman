import React, { Component, FC, PropsWithChildren, useEffect, useRef, createRef, RefObject } from 'react';
import ReactDOM from 'react-dom';
import styles from './style.module.scss';
import BScroll from 'better-scroll';
import { combineClassNames } from '../../helpers/utils';
import { CSSTransition } from 'react-transition-group';
import { Observable } from 'rxjs';

interface Item {
  name: string | number;
  value: string | number;
  disabled?: boolean;
  [prop: string]: any;
}
interface Instance {
  wheelTo(index: number): void;
  getSelectedIndex(): number;
}
interface Props extends PropsWithChildren<any> {
  data: Item[];
  defaultSelectedIndex?: number;
  getInstance?(instance: Instance): void;
}
const defaultProps: Props = {
  data: [],
  defaultSelectedIndex: 0
};
const Picker: FC<Props> = function(props): JSX.Element {
  const { data, getInstance, defaultSelectedIndex } = props;
  const wheelWrapperRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<BScroll>();
  const instanceRef = useRef<Instance>();

  useEffect(() => {
    const instance = instanceRef.current = {
      wheelTo(index: number) {
        scrollRef.current?.wheelTo(index);
      },
      getSelectedIndex() {
        return scrollRef.current?.getSelectedIndex() || 0;
      }
    };
    if (typeof getInstance === 'function') {
      getInstance(instance);
    }
  }, [getInstance, data]);
  useEffect(() => {
    const scroll = scrollRef.current = new BScroll(wheelWrapperRef.current as Element, {
      wheel:{
        selectedIndex: defaultSelectedIndex,
        rotate: 25,
        adjustTime: 400,
        wheelWrapperClass: styles.wheelScroll,
        wheelItemClass: styles.wheelItem,
        wheelDisabledItemClass: styles.wheelDisabledItem
      } as any,
      probeType: 3
    });
    return () => {
      scroll.destroy();
    };
  }, [data, defaultSelectedIndex]);

  return (
    <div ref={wheelWrapperRef} className={styles.wheelWrapper}>
      <ul className={styles.wheelScroll}>
        {
          data.map(item => (
            <li
              key={item.value}
              className={combineClassNames(styles.wheelItem, item.disabled ? styles.wheelDisabledItem : null)}
            >{ item.name }</li>
          ))
        }
      </ul>
    </div>
  );
};
Picker.defaultProps = defaultProps;

export { Picker };

export type PickerDataItem = Item;
export interface MultiPickerDataItem extends Item {
  children?: this[];
}
interface PickerModalProps extends PropsWithChildren<any> {
  data: MultiPickerDataItem[];
  defaultValue?: string | number;
  onSubmit?(value?: string | number): void;
}
interface PickerModalState {
  show: boolean;
  data: MultiPickerDataItem[];
}
export class PickerModal extends Component<PickerModalProps, PickerModalState> {
  readonly state: PickerModalState = {
    show: false,
    data: []
  }
  static defaultProps = {
    data: []
  }
  picker: Instance | null = null;
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
  getPickerInstance(instance: Instance) {
    this.picker = instance;
  }
  setValue(value?: string | number) {
    if (typeof value === 'undefined') {
      return this.picker?.wheelTo(0);
    }
    const { data } = this.state;
    const index = data.findIndex(item => item.value === value);
    if (index > -1) {
      this.picker?.wheelTo(index);
    }
  }
  setData(data: MultiPickerDataItem[]) {
    this.setState({ data });
  }
  onSave(save: boolean) {
    const { onSubmit } = this.props;
    const { data } = this.state;
    if (onSubmit) {
      if (save) {
        const index = this.picker?.getSelectedIndex();
        if (typeof index !== 'undefined' && index > -1) {
          onSubmit(data[index].value);
        } else {
          onSubmit();
        }
      } else {
        onSubmit();
      }
    }
    this.hide();
  }
  componentDidMount() {
    const { data } = this.props;
    this.setData(data);
  }

  render() {
    const { defaultValue } = this.props;
    const { show, data } = this.state;
    const index = data.findIndex(item => item.value === defaultValue);
    return (
      <CSSTransition
        in={show}
        classNames={{
          enter: styles.pickerEnter,
          enterActive: styles.pickerEnterActive,
          exit: styles.pickerExit,
          exitActive: styles.pickerExitActive,
          exitDone: styles.pickerExitDone
        }}
        timeout={300}
      >
        <div className={styles.pickerModalMask} onClick={e => this.onSave(false)}>
          <div className={styles.pickerModal} onClick={this.preventClick}>
            <div className={styles.pickerActions}>
              <span className={styles.cancel} onClick={e => this.onSave(false)}>取消</span>
              <span className={styles.submit} onClick={e => this.onSave(true)}>确定</span>
            </div>
            <Picker data={data} getInstance={this.getPickerInstance.bind(this)} defaultSelectedIndex={index > -1 ? index : 0} />
          </div>
        </div>
      </CSSTransition>
    );
  }
}

export class PickerService {
  ele: Element[] = [];
  create(
    data: MultiPickerDataItem[],
    defaultValue?: string | number,
    afterRender?: (container: Element, modal: PickerModal) => void,
    onSubmit?: (value: string | number) => void
  ): void {
    const pickerModal: RefObject<PickerModal> = createRef<PickerModal>();
    const container = document.createElement('div');
    this.ele.push(container);
    container.className = 'picker-container';
    document.body.appendChild(container);
    ReactDOM.render(<PickerModal data={data} defaultValue={defaultValue} ref={pickerModal} onSubmit={onSubmit} />, container, () => {
        if (afterRender && pickerModal.current) {
          afterRender(container, pickerModal.current);
        }
      }
    );
  }
  open(
    data: MultiPickerDataItem[],
    defaultValue?: string | number,
    callback?: (modal: PickerModal) => void
  ): Observable<any> {
    let container: Element;
    return new Observable(subscriber => {
      this.create(data, defaultValue, (ele, pickerModal) => {
        if (callback) {
          callback(pickerModal);
        }
        container = ele;
        pickerModal.show();
      }, (value?: string | number) => {
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
