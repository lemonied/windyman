import React, { PropsWithChildren, FC, useRef, useEffect, useState } from 'react';
import BScroll, { Position } from 'better-scroll';
import styles from './style.module.scss';
import { Loading } from '../loading';

interface Instance {
  finishPullUp: () => void;
  refresh: () => void;
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
}
const defaultProps: Props = {
  probeType: 1
};

const ScrollY: FC<Props> = function (props): JSX.Element {

  const wrapperRef = useRef<any>(null);
  const instanceRef = useRef<any>(null);
  const [ pullingUp, setPullingUp ] = useState<boolean>(false);

  useEffect(() => {
    const { probeType, onScroll, getInstance, onPullingUp } = props;
    const wrapper = instanceRef.current = new BScroll(wrapperRef.current, {
      scrollY: true,
      click: true,
      probeType
    });
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
    if (typeof getInstance === 'function') {
      getInstance({ finishPullUp, refresh });
    }
    return function () {
      if (instanceRef.current) {
        instanceRef.current.destroy();
      }
    };
  }, [props]);

  return (
    <div className={ styles.scrollYWrapper }>
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
