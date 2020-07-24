import React, {
  FC,
  ReactNode,
  Fragment,
  useState,
  useEffect,
  useRef,
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
  useMemo,
  createRef, useCallback, PropsWithChildren
} from 'react';
import './style.scss';
import ReactDOM from 'react-dom';
import { combineClassNames } from '../../common/utils';

const DefaultAppend:FC<{percent: number;}> = function(props) {
  const { percent = 0 } = props;
  return (
    <Fragment>{percent} %</Fragment>
  );
};

interface NormalProgressProps extends PropsWithChildren<any>{
  percent: number;
  progress?: ProgressInstance;
  after?: ReactNode;
  middle?: ReactNode;
  height?: number;
  className?: string;
  trailColor?: string;
  color?: string;
}

interface CircleProgressProps extends NormalProgressProps {
  type?: 'circle';
}
const CircleProgress: FC<CircleProgressProps> = function(props) {
  const { percent, middle, className, trailColor, color } = props;

  return (
    <div className={combineClassNames('windy-circle-progress', className)}>
      <svg className="circle-progress" viewBox="0 0 100 100">
        <path
          style={{ strokeDasharray: `${94 * 3.14}px, ${94 * 3.14}px` }}
          className="circle-trail"
          d="M 50,50 m 0,-47a 47,47 0 1 1 0,94a 47,47 0 1 1 0,-94"
          strokeLinecap="round"
          strokeWidth="6"
          fillOpacity="0"
          stroke={trailColor}
        />
        <path
          style={{ strokeDasharray: `${94 * percent / 100 * 3.14}px, ${94 * 3.14}px` }}
          className="circle-path"
          d="M 50,50 m 0,-47a 47,47 0 1 1 0,94a 47,47 0 1 1 0,-94"
          strokeLinecap="round"
          strokeWidth="6"
          opacity="1"
          fillOpacity="0"
          stroke={color}
        />
      </svg>
      {
        typeof middle === 'undefined' ?
          <div className={'windy-circle-progress-middle'}>
            <DefaultAppend percent={percent} />
          </div> :
          middle !== null ?
            <div className={'windy-circle-progress-middle'}>{middle}</div> :
            null
      }
    </div>
  );
};

interface LineProgressProps extends NormalProgressProps {
  type?: 'line';
  onChange?: (percent: number) => void;
}
const LineProgress: FC<LineProgressProps> = function (props) {
  const { percent = 0, after, height = 5, className, trailColor, color, onChange } = props;

  const [ realPercent, setRealPercent ] = useState(0);
  const [ slow, setSlow ] = useState(true);

  const progressBarRef = useRef<HTMLDivElement>(null);
  const touchRef = useRef({
    isMove: false,
    status: false,
    offset: 0
  });

  useEffect(() => {
    setRealPercent(percent);
  }, [percent]);

  const handleChange = useCallback((percent: number) => {
    if (typeof onChange === 'function') {
      onChange(Number(percent.toFixed(2)));
    }
  }, [onChange]);

  const touchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSlow(false);
    touchRef.current.status = true;
  }, []);
  const touchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!touchRef.current.status) {
      return;
    }
    touchRef.current.isMove = true;
    const barWidth = progressBarRef.current?.clientWidth || 0;
    const offset = touchRef.current.offset = Math.min(e.touches[0].pageX - (progressBarRef.current?.offsetLeft || 0), barWidth);
    setRealPercent(offset / barWidth * 100);
  }, []);
  const touchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const barWidth = progressBarRef.current?.clientWidth || 0;
    if (!touchRef.current.isMove) {
      return;
    }
    touchRef.current.status = false;
    touchRef.current.isMove = false;
    handleChange(touchRef.current.offset / barWidth);
    setSlow(true);
  }, [handleChange]);
  const progressClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const barWidth = progressBarRef.current?.clientWidth || 0;
    const offset = touchRef.current.offset = e.pageX - (progressBarRef.current?.offsetLeft || 0);
    setRealPercent(offset / barWidth * 100);
    handleChange(touchRef.current.offset / barWidth);
  }, [handleChange]);

  return (
    <div
      className={combineClassNames('windy-progress-outer', className)}
      onTouchStart={touchStart}
      onTouchMove={touchMove}
      onTouchEnd={touchEnd}
      onClick={progressClick}
    >
      <div
        className={'windy-progress-inner'}
        style={{height, backgroundColor: trailColor}}
        ref={progressBarRef}
      >
        <div
          className={combineClassNames('windy-progress-bg', slow ? 'slow' : null)}
          style={{width: `${realPercent}%`, backgroundColor: color}}
        >
          <div className={'progress-btn-wrapper'}>
            <div className="progress-btn" />
            <div className="progress-btn-circle" />
          </div>
        </div>
      </div>
      {
        typeof after === 'undefined' ?
          <div className={'windy-progress-after'}>
            <DefaultAppend percent={percent} />
          </div> :
          after
      }

    </div>
  );
};

interface ProgressInstance {
  setPercent: (percent: number) => void;
}
export const useProgress = (): ProgressInstance => {
  const instance = useRef<ProgressInstance>({} as ProgressInstance);
  return instance.current;
};
type ProgressProps = LineProgressProps | CircleProgressProps;
const ProgressFc: ForwardRefRenderFunction<ProgressInstance, ProgressProps> = function(props, ref) {
  const { type = 'line', percent = 0, progress, after, middle, height, className, onChange } = props;
  const [count, setCount] = useState(percent);
  useEffect(() => {
    setCount(percent);
  }, [percent]);
  const instance = useMemo<ProgressInstance>(() => {
    return {
      setPercent: setCount
    };
  }, []);
  useEffect(() => {
    if (typeof progress !== 'undefined') {
      Object.assign(progress, instance);
    }
  }, [progress, instance]);
  useImperativeHandle(ref, () => {
    return instance;
  });

  switch (type) {
    case 'line':
      return <LineProgress percent={count} after={after} height={height} className={className} onChange={onChange} />;
    case 'circle':
      return <CircleProgress percent={count} middle={middle} className={className} />;
    default:
      return null;
  }
};

export const Progress = forwardRef<ProgressInstance, ProgressProps>(ProgressFc);

interface ProgressServiceOptions {
  defaultPercent?: number;
  height?: number;
}
export class ProgressService {
  ele: Element | null = null;
  instance = createRef<ProgressInstance>();

  // 1 ~ 100
  set(percent: number) {
    this.instance.current?.setPercent(percent);
  }
  open(options: ProgressServiceOptions = {}) {
    const { defaultPercent = 0, height = 2 } = options;
    this.destroyAll();
    const container = document.createElement('div');
    container.className = 'progress-container';
    document.body.appendChild(container);
    ReactDOM.render(
      <Progress type={'line'} percent={0} ref={this.instance} after={null} height={height} />,
      container,
      () => setTimeout(() => this.set(defaultPercent))
    );
    this.ele = container;
  }
  destroyAll() {
    if (this.ele) {
      ReactDOM.unmountComponentAtNode(this.ele);
      this.ele.remove();
    }
  }
}

export const progressBar = new ProgressService();
