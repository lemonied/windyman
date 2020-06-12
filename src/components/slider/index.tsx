import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
  memo,
  Children,
  useMemo,
  ReactElement
} from 'react';
import styles from './style.module.scss';
import { BScroll } from '../better-scroll';
import { debounce } from '../../common/utils';

interface SliderInstance {
  next(time?: number, easing?: object): void;
  prev(time?: number, easing?: object): void;
  destroy(): void;
  refresh(): void;
  play(): void;
  stop(): void;
}
interface Props extends PropsWithChildren<any> {
  children: ReactElement[];
  dot?: boolean;
  loop?: boolean;
  click?: boolean;
  interval?: number;
  autoplay?: boolean;
  threshold?: number;
  speed?: number;
  getInstance?: (instance: SliderInstance) => void;
  data?: any;
  slider?: { [prop: string]: any };
}
const defaultProps: Props = {
  children: [],
  loop: true,
  click: true,
  interval: 4000,
  autoplay: true,
  threshold: 0.3,
  speed: 400
};
// Slider Hook
export const useSlider = ():SliderInstance  => {
  const instance = useRef<SliderInstance>({} as SliderInstance);
  return instance.current;
};
const Slider: FC<Props> = function(props): JSX.Element {
  const { children, dot, loop, click, interval, autoplay, threshold, speed, getInstance, data, slider } = props;

  const [ currentIndex, setCurrentIndex ] = useState<number>(0);
  const scrollRef = useRef<BScroll>();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const slideGroupRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>();
  const childrenLength = useMemo(() => {
    return Children.toArray(children).length;
  }, [children]);

  const initSlideWidth = useCallback(() => {
    const wrapper = wrapperRef.current;
    const slideGroup: any = slideGroupRef.current;
    const items: any = slideGroupRef.current?.children;
    if (wrapper && items && slideGroup) {
      slideGroup.style.width =  wrapper.clientWidth * childrenLength + (loop ? 2 * wrapper.clientWidth : 0) + 'px';
      Array.prototype.slice.call(items).forEach((item: HTMLElement) => {
        item.style.width = wrapper.clientWidth + 'px';
      });
    }
  }, [loop, childrenLength]);
  const instance = useMemo<SliderInstance>(() => {
    return {
      prev: (...args) => {
        scrollRef.current?.prev(...args);
      },
      next: (...args) => {
        scrollRef.current?.next(...args);
      },
      destroy: () => {
        clearTimeout(timerRef.current);
        scrollRef.current?.destroy();
      },
      refresh: () => {
        scrollRef.current?.refresh();
      },
      play: () => {
        clearTimeout(timerRef.current);
        if (autoplay) {
          timerRef.current = setTimeout(() => {
            instance.next();
          }, interval);
        }
      },
      stop: () => {
        clearTimeout(timerRef.current);
      }
    };
  }, [autoplay, interval]);
  useEffect(() => {
    initSlideWidth();
    const scroll = scrollRef.current = new BScroll(wrapperRef.current as Element, {
      scrollX: true,
      scrollY: false,
      momentum: false,
      snap: {
        loop: loop,
        threshold: threshold,
        speed: speed
      },
      bounce: false,
      stopPropagation: true,
      click: click,
      observeDOM: false
    });
    setCurrentIndex(0);
    instance.play();
    scroll.on('scrollEnd', () => {
      setCurrentIndex(scroll.getCurrentPage().pageX);
      instance.play();
    });
    scroll.on('touchEnd', () => {
      instance.play();
    });
    scroll.on('beforeScrollStart', () => {
      instance.stop();
    });
    const onResize = debounce(() => {
      initSlideWidth();
      instance.refresh();
    }, 300);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      instance.destroy();
    };
  }, [initSlideWidth, loop, threshold, speed, click, instance, data]);
  // use instance
  useEffect(() => {
    if (typeof getInstance === 'function') {
      getInstance(instance);
    }
    if (slider && typeof slider === 'object') {
      Object.assign(slider, instance);
    }
  }, [instance, getInstance, slider]);

  return (
    <div ref={wrapperRef} className={styles.slider}>
      <div className={styles.sliderGroup} ref={slideGroupRef}>
        {
          Children.map(children, ((item, key) => (
            <div
              className={styles.slideItem}
              key={key}
            >{ item }</div>
          )))
        }
      </div>
      {
        dot ?
          <div className={styles.dotGroup}>
            { Children.map(children, (item, key) => (<span key={key} className={currentIndex === key ? 'active' : ''} />)) }
          </div> :
          null
      }
    </div>
  );
};
Slider.defaultProps = defaultProps;

export const Sliders = memo(Slider);
