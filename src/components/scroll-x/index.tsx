import React, {
  CSSProperties,
  forwardRef,
  ForwardRefRenderFunction,
  ReactElement, useEffect,
  useImperativeHandle,
  useMemo,
  useRef, useState
} from 'react';
import './style.scss';
import { combineClassNames } from '../../common/utils';
import { BScroll } from '../better-scroll';

interface ScrollXInstance extends BScroll {

}
interface ScrollXProps {
  children?: ReactElement;
  scroll?: ScrollXInstance;
  className?: string;
  style?: CSSProperties;
  dot?: boolean;
}
export const useScrollX = (): ScrollXInstance => {
  const instance = useRef<ScrollXInstance>({} as ScrollXInstance);
  return instance.current;
};
const ScrollXFc: ForwardRefRenderFunction<ScrollXInstance, ScrollXProps> = (props, ref) => {
  const { children, className, scroll, style, dot } = props;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<BScroll>();
  const dotRef = useRef<HTMLDivElement>(null);
  const [ isInit, setIsInit ] = useState<boolean>(false);

  useEffect(() => {
    const scroll = scrollRef.current = new BScroll(wrapperRef.current as Element, {
      probeType: 3,
      scrollX: true,
      scrollY: false,
      eventPassthrough: 'vertical'
    });
    scroll.on('scroll', (pos: any) => {
      const dot = dotRef.current;
      const wrapper = wrapperRef.current;
      if (dot && wrapper) {
        const x = Math.min(Math.max(pos.x, scroll.maxScrollX), 0) * 100;
        dot.style.left = Math.abs(x / scroll.maxScrollX) * 0.5 + '%';
      }
    });
    setIsInit(true);
    return () => {
      scrollRef.current?.destroy();
    };
  }, []);
  const instance = useMemo<ScrollXInstance>(() => {
    if (!isInit) { return {} as ScrollXInstance; }
    return scrollRef.current || {} as ScrollXInstance;
  }, [isInit]);
  useEffect(() => {
    if (scroll) {
      Object.assign(scroll, instance);
    }
  }, [scroll, instance]);

  useImperativeHandle(ref, () => {
    return instance;
  });

  return (
    <div
      className={combineClassNames('windy-scroll-x', className, dot ? 'has-dot' : '')}
      ref={wrapperRef}
      style={style}
    >
      { children }
      {
        dot ?
          <div className={'scroll-x-dot-group'}>
            <div className={'scroll-x-dot'} ref={dotRef} />
          </div> :
          null
      }
    </div>
  );
};

export const ScrollX = forwardRef<ScrollXInstance, ScrollXProps>(ScrollXFc);
