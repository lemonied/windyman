import React, { PropsWithChildren, FC, useRef, useEffect, useState, CSSProperties } from 'react';
import BScroll, { Position } from 'better-scroll';
import styles from './style.module.scss';
import { Loading } from '../loading';

interface BScroller extends BScroll{
  closePullUp: () => void;
  openPullUp: (option?: any) => void;
}

export interface Instance {
  finishPullUp: () => void;
  refresh: () => void;
  closePullUp: () => void;
  openPullUp: (option?: any) => void;
}
/*
* @Params probeType
* When set to 1, The scroll event is non-real time fired (after the screen scrolled for some time)
* When set to 2, the scroll event is real-time fired during the screen scrolling
* When set to 3, the scroll event is real-time fired during not only the screen scrolling but also the momentum and bounce animation
* If not set, the default value 0 means there is no scroll event is fired.
*/
interface Props extends PropsWithChildren<any> {
  probeType?: 1 | 2 | 3;
  onScroll?: (position: Position) => void;
  getInstance?: (context: Instance) => void;
  onPullingUp?: () => void;
  style?: CSSProperties;
}
const defaultProps: Props = {
  probeType: 1
};

const ScrollY: FC<Props> = function (props): JSX.Element {

  const { style } = props;

  const wrapperRef = useRef<any>(null);
  const instanceRef = useRef<any>(null);
  const [ pullingUp, setPullingUp ] = useState<boolean>(false);

  // Create Scroller
  useEffect(() => {
    const { probeType, onScroll, getInstance, onPullingUp } = props;
    const pullUpLoadConf = { threshold: 50 };
    const wrapper: BScroller = instanceRef.current = new BScroll(wrapperRef.current, {
      scrollY: true,
      click: true,
      probeType,
      pullUpLoad: onPullingUp ? pullUpLoadConf : false
    }) as BScroller;
    wrapper.on('scroll', (e: any) => {
      if (typeof onScroll === 'function') {
        onScroll(e);
      }
    });
    wrapper.on('pullingUp', () => {
      if (typeof onPullingUp === 'function') {
        setPullingUp(true);
        onPullingUp();
      }
    });
    const refresh = () => {
      wrapper.refresh();
    };
    const finishPullUp = () => {
      setPullingUp(false);
      wrapper.finishPullUp();
      setTimeout(refresh, 20);
    };
    const closePullUp = () => {
      finishPullUp();
      wrapper.closePullUp();
    };
    const openPullUp = (option = pullUpLoadConf) => {
      wrapper.openPullUp(option);
    };
    const instance = { finishPullUp, refresh, closePullUp, openPullUp };
    if (typeof getInstance === 'function') {
      getInstance(instance);
    }
    return function () {
      instanceRef.current?.destroy();
    };
  }, [props]);

  return (
    <div className={ styles.scrollYWrapper } style={style}>
      <div className={ styles.scrollY } ref={ wrapperRef }>
        <div>
          { props.children }
          {
            pullingUp ?
              <Loading /> :
              null
          }
        </div>
      </div>
    </div>
  );
};
ScrollY.defaultProps = defaultProps;

export { ScrollY }
