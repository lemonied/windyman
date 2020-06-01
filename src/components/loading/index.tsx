import React, { CSSProperties, FC, PropsWithChildren } from 'react';
import styles from './style.module.scss';
import gif from './loading.gif';

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
    <div className={ styles.loading } style={ style }>
      <img width="20" src={gif} alt="loading" />
      {
        title ?
          <span className={ styles.title }>{ title }</span> :
          null
      }
    </div>
  );
};
Loading.defaultProps = defaultProps;

export { Loading };
