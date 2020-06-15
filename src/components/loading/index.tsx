import React, { CSSProperties, FC, PropsWithChildren } from 'react';
import './style.scss';
import { LoadingIcon } from './spin/loading';

interface LoadingProps extends PropsWithChildren<any> {
  title?: string;
  style?: CSSProperties;
  width?: number;
  height?: number;
}

const defaultProps: LoadingProps = {
  style: { padding: '8px 0' }
};

const Loading: FC<LoadingProps> = function(props): JSX.Element {
  const { title, style, width = 15, height = 15 } = props;
  return (
    <div className={'windy-loading'} style={ style }>
      <LoadingIcon width={width} height={height} />
      {
        title ?
          <span className={'title'}>{ title }</span> :
          null
      }
    </div>
  );
};
Loading.defaultProps = defaultProps;

export { Loading };
