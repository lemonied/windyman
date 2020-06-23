import React, { FC, ReactNode, Fragment } from 'react';
import './style.scss';

const DefaultAppend:FC<{percent: number;}> = function(props) {
  const { percent = 0 } = props;
  return (
    <Fragment>{percent} %</Fragment>
  );
};

interface NormalProgressProps {
  percent: number;
}

interface CircleProgressProps extends NormalProgressProps {
  type?: 'circle';
  middle?: string | ReactNode | null;
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
      <div className={'windy-circle-progress-middle'}>
        {
          middle === null ?
            middle :
            <DefaultAppend percent={percent} />
        }
      </div>
    </div>
  );
};

interface LineProgressProps extends NormalProgressProps {
  type?: 'line';
  after?: string | ReactNode | null;
}
const LineProgress: FC<LineProgressProps> = function (props) {
  const { percent = 0, after } = props;

  return (
    <div className={'windy-progress-outer'}>
      <div className={'windy-progress-inner'}>
        <div className={'windy-progress-bg'} style={{width: `${percent}%`}} />
      </div>
      <div className={'windy-progress-after'}>
        {
          after === null ?
            after :
            <DefaultAppend percent={percent} />
        }
      </div>
    </div>
  );
};

type ProgressProps = LineProgressProps | CircleProgressProps;
const Progress: FC<ProgressProps> = function(props) {
  const { type = 'line', percent = 0 } = props;

  switch (type) {
    case 'line':
      return <LineProgress percent={percent} />;
    case 'circle':
      return <CircleProgress percent={percent} />;
    default:
      return null;
  }
};

export { Progress };
