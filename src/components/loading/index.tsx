import React, { CSSProperties, FC, PropsWithChildren } from 'react';
import './style.scss';
import { LoadingIcon } from './loading';

interface Props extends PropsWithChildren<any> {
  title?: string;
  style?: CSSProperties;
}

const defaultProps: Props = {
  style: { padding: '8px 0' }
};

const Loading: FC<Props> = function(props): JSX.Element {
  const { title, style } = props;
  return (
    <div className={'windy-loading'} style={ style }>
      <LoadingIcon width={20} height={20} />
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
