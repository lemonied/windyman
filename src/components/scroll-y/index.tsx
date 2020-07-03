import React, {
  FC,
  useEffect,
  useState,
  CSSProperties,
  useCallback,
  useRef,
  useMemo,
  forwardRef,
  ForwardRefRenderFunction, useImperativeHandle, ReactNode
} from 'react';
import { BScroll } from '../better-scroll';
import { Position } from '../better-scroll/bscroll';
import './style.scss';
import { Loading } from '../loading';

interface BScroller extends BScroll {
  closePullUp: () => void;
  openPullUp: (option?: any) => void;
  openPullDown: (options?: any) => void;
}

interface ScrollYInstance {
  finishPullUp: () => void;
  refresh: () => void;
  closePullUp: () => void;
  openPullUp: (option?: any) => void;
  finishPullDown: () => void;
  openPullDown: (options?: any) => void;
  scrollTo: BScroller['scrollTo'];
  scrollToElement: BScroller['scrollToElement'];
}
// ScrollY Hook
export const useScrollY = (): ScrollYInstance => {
  const scroll = useRef<ScrollYInstance>({} as ScrollYInstance);
  return scroll.current;
};
/*
* @Params probeType
* When set to 1, The scroll event is non-real time fired (after the screen scrolled for some time)
* When set to 2, the scroll event is real-time fired during the screen scrolling
* When set to 3, the scroll event is real-time fired during not only the screen scrolling but also the momentum and bounce animation
* If not set, the default value 0 means there is no scroll event is fired.
*/
interface Props {
  probeType?: 1 | 2 | 3;
  onScroll?: (position: Position) => void;
  onPullingUp?: () => void;
  onPullingDown?: () => void;
  style?: CSSProperties;
  scroll?: { [prop: string]: any };
  children?: ReactNode;
  data?: any;
}
// ScrollY Component
const ScrollYFc: ForwardRefRenderFunction<ScrollYInstance, Props> = function (props, ref) {

  const { style, children, data } = props;
  const { onScroll, onPullingDown, onPullingUp, scroll } = props;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<BScroller>();
  const enablePullUpRef = useRef<boolean>(!!onPullingUp);
  const bubble = useBubble();
  // Initial top value
  const bubbleInit = useRef({ initTop: -100 });
  const [ pullingUp, setPullingUp ] = useState<boolean>(false);
  const [ bubbleY, setBubbleY ] = useState<number>(0);
  const [ loadingTop, setLoadingTop ] = useState<number>(bubbleInit.current.initTop);
  const [ pullingDown, setPullingDown ] = useState<boolean>(false);
  const [ pullingDownSnapshot, setPullingDownSnapshot ] = useState<boolean>(false);
  const [ isOpenPullingDown, setIsOpenPullingDown ] = useState<boolean>(!!onPullingDown);
  const propsRef = useRef<Props>(Object.assign({}, props));
  const pullUpLoadConf = useMemo(() => {
    return { threshold: 50 };
  }, []);
  const pullDownConf = useMemo(() => {
    return { threshold: 60, stop: 30 };
  }, []);

  // Create Scroller
  useEffect(() => {
    const { probeType = 1, onPullingUp, onPullingDown } = propsRef.current;
    instanceRef.current = new BScroll(wrapperRef.current as Element, {
      scrollY: true,
      click: true,
      probeType,
      pullUpLoad: onPullingUp ? pullUpLoadConf : false,
      pullDownRefresh: onPullingDown ? pullDownConf : false
    }) as BScroller;
    return function () {
      instanceRef.current?.destroy();
    };
  }, [pullDownConf, pullUpLoadConf]);
  // onScroll
  useEffect(() => {
    const wrapper = instanceRef.current;
    const bubbleConf = bubble.conf;
    const listener = (e: any) => {
      if (typeof onScroll === 'function') {
        onScroll(e);
      }
      // bubble y
      if (typeof onPullingDown === 'function' && bubbleConf) {
        const bubbleHeight = bubbleConf.headRadius / bubbleConf.ratio * 2.5;
        setBubbleY(Math.max(0, e.y - bubbleHeight));
        const loadingPosTop = Math.min(-2, e.y - pullDownConf.threshold);
        setLoadingTop(loadingPosTop);
      }
    };
    wrapper?.on('scroll', listener);
    return () => {
      instanceRef.current?.off('scroll', listener);
    };
  }, [onScroll, onPullingDown, pullDownConf, bubble]);
  // on pulling up and pulling down
  useEffect(() => {
    const wrapper = instanceRef.current;
    const pullingUp = () => {
      if (!enablePullUpRef.current) { return; }
      enablePullUpRef.current = false;
      if (typeof onPullingUp === 'function') {
        setPullingUp(true);
        onPullingUp();
      }
    };
    const pullingDown = () => {
      if (typeof onPullingDown === 'function') {
        setPullingDown(true);
        onPullingDown();
      }
    };
    wrapper?.on('pullingUp', pullingUp);
    wrapper?.on('pullingDown', pullingDown);
    return () => {
      instanceRef.current?.off('pullingUp', pullingUp);
      instanceRef.current?.off('pullingDown', pullingDown);
    };
  }, [onPullingUp, onPullingDown]);
  // instance
  const instance = useMemo<ScrollYInstance>(() => {
    const refresh = () => {
      instanceRef.current?.refresh();
    };
    const finishPullUp = () => {
      setPullingUp(false);
      instanceRef.current?.finishPullUp();
      enablePullUpRef.current = true;
    };
    const closePullUp = () => {
      finishPullUp();
      enablePullUpRef.current = false;
      instanceRef.current?.closePullUp();
    };
    const openPullUp = (option = pullUpLoadConf) => {
      enablePullUpRef.current = true;
      instanceRef.current?.openPullUp(option);
    };
    const finishPullDown = () => {
      instanceRef.current?.finishPullDown();
      setPullingDown(false);
      setPullingDownSnapshot(true);
      setTimeout(() => {
        setLoadingTop(bubbleInit.current.initTop);
        setPullingDownSnapshot(false);
      }, 500);
    };
    const openPullDown = (options = pullDownConf) => {
      instanceRef.current?.openPullDown(options);
      setIsOpenPullingDown(true);
    };
    return {
      finishPullUp,
      refresh,
      closePullUp,
      openPullUp,
      finishPullDown,
      openPullDown,
      scrollTo: (...args) => {
        instanceRef.current?.scrollTo(...args);
      },
      scrollToElement: (...args) => {
        instanceRef.current?.scrollToElement(...args);
      }
    };
  }, [pullDownConf, pullUpLoadConf]);
  // use instance
  useEffect(() => {
    if (scroll && typeof scroll === 'object') {
      Object.assign(scroll, instance);
    }
  }, [scroll, instance]);
  // watch data change
  useEffect(() => {
    instance.refresh();
  }, [instance, data]);

  useImperativeHandle(ref, () => {
    return instance;
  });

  return (
    <div className={ 'windy-scroll-y-wrapper' } style={style}>
      {
        isOpenPullingDown ?
          pullingDownSnapshot ?
            null :
            <div className={'loading-wrapper'} style={{ top: pullingDown ? -2 : loadingTop }}>
              {
                pullingDown ?
                  <Loading title={'加载中...'} /> :
                  <Bubble
                    y={bubbleY}
                    bubble={bubble}
                  />
              }
            </div> :
          null
      }
      <div className={ 'scroll-y' } ref={ wrapperRef }>
        <div>
          { children }
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

export const ScrollY = forwardRef<ScrollYInstance, Props>(ScrollYFc);

interface BubbleConf {
  ratio: number;
  initRadius: number;
  minHeadRadius: number;
  minTailRadius: number;
  initArrowRadius: number;
  minArrowRadius: number;
  arrowWidth: number;
  maxDistance: number;
  initCenterX: number;
  initCenterY: number;
  headCenter: { x: number; y: number; };
  headRadius: number;
  distance: number;
}
interface BubbleInstance {
  conf: BubbleConf;
}
interface BubbleProps {
  y: number;
  getInstance?: (instance: BubbleInstance) => void;
  bubble?: { [prop: string]: any };
}
const useBubble = (): BubbleInstance => {
  const instance = useRef<BubbleInstance>({} as BubbleInstance);
  return instance.current;
};
const Bubble: FC<BubbleProps> = function(props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dataRef = useRef<BubbleConf>({
    ratio: window.devicePixelRatio,
    initRadius: 0,
    minHeadRadius: 0,
    minTailRadius: 0,
    initArrowRadius: 0,
    minArrowRadius: 0,
    arrowWidth: 0,
    maxDistance: 0,
    initCenterX: 0,
    initCenterY: 0,
    headCenter: { x: 0, y: 0 },
    headRadius: 0,
    distance: 0
  });
  const { y = 0, getInstance, bubble } = props;
  const [ width, setWidth ] = useState<number>(50);
  const [ height, setHeight ] = useState<number>(80);

  // draw bubble
  const drawBubble = useCallback((ctx: CanvasRenderingContext2D) => {
    const conf = dataRef.current;
    ctx.save();
    ctx.beginPath();
    const rate = conf.distance / conf.maxDistance;
    const headRadius = conf.headRadius = conf.initRadius - (conf.initRadius - conf.minHeadRadius) * rate;
    conf.headCenter.y = conf.initCenterY - (conf.initRadius - conf.minHeadRadius) * rate;
    // draw the upper half of the arc
    ctx.arc(conf.headCenter.x, conf.headCenter.y, headRadius, 0, Math.PI, true);
    // draw bezier curve on the left
    const tailRadius = conf.initRadius - (conf.initRadius - conf.minTailRadius) * rate;
    const tailCenter = {
      x: conf.headCenter.x,
      y: conf.headCenter.y + conf.distance
    };
    const tailPointL = {
      x: tailCenter.x - tailRadius,
      y: tailCenter.y
    };
    const controlPointL = {
      x: tailPointL.x,
      y: tailPointL.y - conf.distance / 2
    };
    ctx.quadraticCurveTo(controlPointL.x, controlPointL.y, tailPointL.x, tailPointL.y);
    // draw the bottom half of the arc
    ctx.arc(tailCenter.x, tailCenter.y, tailRadius, Math.PI, 0, true);
    // draw bezier curve on the right
    const headPointR = {
      x: conf.headCenter.x + headRadius,
      y: conf.headCenter.y
    };
    const controlPointR = {
      x: tailCenter.x + tailRadius,
      y: headPointR.y + conf.distance / 2
    };
    ctx.quadraticCurveTo(controlPointR.x, controlPointR.y, headPointR.x, headPointR.y);
    ctx.fillStyle = 'rgb(170,170,170)';
    ctx.fill();
    ctx.strokeStyle = 'rgb(153,153,153)';
    ctx.stroke();
    ctx.restore();
  }, []);
  // draw arrow
  const drawArrow = useCallback((ctx: CanvasRenderingContext2D) => {
    const conf = dataRef.current;
    ctx.save();
    ctx.beginPath();
    const rate = conf.distance / conf.maxDistance;
    const arrowRadius = conf.initArrowRadius - (conf.initArrowRadius - conf.minArrowRadius) * rate;
    // draw inner circle
    ctx.arc(conf.headCenter.x, conf.headCenter.y, arrowRadius - (conf.arrowWidth - rate), -Math.PI / 2, 0, true);
    // draw outer circle
    ctx.arc(conf.headCenter.x, conf.headCenter.y, arrowRadius, 0, Math.PI * 3 / 2, false);
    ctx.lineTo(conf.headCenter.x, conf.headCenter.y - arrowRadius - conf.arrowWidth / 2 + rate);
    ctx.lineTo(conf.headCenter.x + conf.arrowWidth * 2 - rate * 2, conf.headCenter.y - arrowRadius + conf.arrowWidth / 2);
    ctx.lineTo(conf.headCenter.x, conf.headCenter.y - arrowRadius + conf.arrowWidth * 3 / 2 - rate);
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.fill();
    ctx.strokeStyle = 'rgb(170,170,170)';
    ctx.stroke();
    ctx.restore();
  }, []);
  const draw = useCallback(() => {
    const bubble = canvasRef.current;
    if (bubble) {
      const ctx = bubble.getContext('2d') as CanvasRenderingContext2D;
      ctx.clearRect(0, 0, bubble.width, bubble.height);
      drawBubble(ctx);
      drawArrow(ctx);
    }
  }, [drawBubble, drawArrow]);

  // Initial data
  useEffect(() => {
    const conf = dataRef.current;
    const ratio = conf.ratio;
    conf.initRadius = 16 * ratio;
    conf.minHeadRadius = 12 * ratio;
    conf.minTailRadius = 5 * ratio;
    conf.initArrowRadius = 10 * ratio;
    conf.minArrowRadius = 6 * ratio;
    conf.arrowWidth = 3 * ratio;
    conf.maxDistance = 40 * ratio;
    conf.initCenterX = 25 * ratio;
    conf.initCenterY = 25 * ratio;
    conf.headCenter = {
      x: conf.initCenterX,
      y: conf.initCenterY
    };
  }, []);
  // use instance
  useEffect(() => {
    const instance = { conf: dataRef.current };
    if (typeof getInstance === 'function') {
      getInstance(instance);
    }
    if (bubble && typeof bubble === 'object') {
      Object.assign(bubble, instance);
    }
  }, [getInstance, bubble]);
  // Initial width and height when the component is created
  useEffect(() => {
    const conf = dataRef.current;
    setWidth(prev => conf.ratio * prev);
    setHeight(prev => conf.ratio * prev);
  }, []);
  // redraw after y was changed
  useEffect(() => {
    const conf = dataRef.current;
    conf.distance = Math.max(0, Math.min(y * conf.ratio, conf.maxDistance));
    draw();
  }, [y, draw]);
  // draw while canvas is ready
  useEffect(() => {
    draw();
  }, [width, height, draw]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: width / dataRef.current.ratio,
        height: height / dataRef.current.ratio
      }}
      width={width}
      height={height}
    />
  );
};
