import React, {
  FC,
  ReactNode,
  Fragment,
  useState,
  useEffect,
  useRef,
  forwardRef,
  ForwardRefRenderFunction, useImperativeHandle, useMemo, createRef
} from 'react';
import './style.scss';
import ReactDOM from 'react-dom';

const DefaultAppend:FC<{percent: number;}> = function(props) {
  const { percent = 0 } = props;
  return (
    <Fragment>{percent} %</Fragment>
  );
};

interface NormalProgressProps {
  percent: number;
  progress?: ProgressInstance;
  after?: ReactNode;
  middle?: ReactNode;
  height?: number;
}

interface CircleProgressProps extends NormalProgressProps {
  type?: 'circle';
}
const CircleProgress: FC<CircleProgressProps> = function(props) {
  const { percent, middle } = props;

  return (
    <div className={'windy-circle-progress'}>
      <svg className="circle-progress" viewBox="0 0 100 100">
        <path
          style={{ strokeDasharray: `${94 * 3.14}px, ${94 * 3.14}px` }}
          className="circle-trail"
          d="M 50,50 m 0,-47a 47,47 0 1 1 0,94a 47,47 0 1 1 0,-94"
          strokeLinecap="round"
          strokeWidth="6"
          fillOpacity="0"
        />
        <path
          style={{ strokeDasharray: `${94 * percent / 100 * 3.14}px, ${94 * 3.14}px` }}
          className="circle-path"
          d="M 50,50 m 0,-47a 47,47 0 1 1 0,94a 47,47 0 1 1 0,-94"
          strokeLinecap="round"
          strokeWidth="6"
          opacity="1"
          fillOpacity="0"
        />
      </svg>
      {
        typeof middle === 'undefined' ?
          <div className={'windy-circle-progress-middle'}>
            <DefaultAppend percent={percent} />
          </div> :
          middle
      }
    </div>
  );
};

interface LineProgressProps extends NormalProgressProps {
  type?: 'line';
}
const LineProgress: FC<LineProgressProps> = function (props) {
  const { percent = 0, after, height = 5 } = props;

  return (
    <div className={'windy-progress-outer'}>
      <div className={'windy-progress-inner'} style={{height}}>
        <div className={'windy-progress-bg'} style={{width: `${percent}%`}} />
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
  setPercent?: (percent: number) => void;
}
export const useProgress = (): ProgressInstance => {
  const instance = useRef<ProgressInstance>({});
  return instance.current;
};
type ProgressProps = LineProgressProps | CircleProgressProps;
const ProgressFc: ForwardRefRenderFunction<ProgressInstance, ProgressProps> = function(props, ref) {
  const { type = 'line', percent = 0, progress, after, middle, height } = props;
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
      return <LineProgress percent={count} after={after} height={height} />;
    case 'circle':
      return <CircleProgress percent={count} middle={middle} />;
    default:
      return null;
  }
};

export const Progress = forwardRef<ProgressInstance, ProgressProps>(ProgressFc);

export class ProgressService {
  ele: Element[] = [];

  open(defaultPercent = 0) {
    const instance = createRef<ProgressInstance>();
    const container = document.createElement('div');
    container.className = 'progress-container';
    document.body.appendChild(container);
    ReactDOM.render(
      <Progress type={'line'} percent={defaultPercent} ref={instance} after={null} height={2} />,
      container
    );
    this.ele.push(container);
    return {
      destroy: () => {
        const index = this.ele.findIndex(val => val === container);
        if (index > -1) {
          this.ele.splice(index, 1);
        }
        ReactDOM.unmountComponentAtNode(container);
        container.remove();
      },
      set(percent: number) {
        if (instance.current?.setPercent) {
          instance.current.setPercent(percent);
        }
      }
    };
  }
  destroyAll() {
    this.ele.forEach(ele => {
      ReactDOM.unmountComponentAtNode(ele);
      ele.remove();
    });
  }
}

export const progress = new ProgressService();
