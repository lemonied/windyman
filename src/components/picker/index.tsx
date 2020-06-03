import React, { Component, FC, PropsWithChildren, useEffect, useRef } from 'react';
import styles from './style.module.scss';
import BScroll from 'better-scroll';
import { combineClassNames } from '../../helpers/utils';
import { CSSTransition } from 'react-transition-group';

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
          data.map((item, key) => (
            <li
              key={key}
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

interface PickerModalProps extends PropsWithChildren<any> {
  data: Item[];
}
export class PickerModal extends Component<PickerModalProps, { show: boolean }> {
  readonly state = {
    show: false
  }
  static defaultProps = {
    data: []
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
  render() {
    const { data } = this.props;
    const { show } = this.state;
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
        <div className={styles.pickerModalMask} onClick={this.hide.bind(this)}>
          <div className={styles.pickerModal} onClick={this.preventClick}>
            <Picker data={data} />
          </div>
        </div>
      </CSSTransition>
    );
  }
}
