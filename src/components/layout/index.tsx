import React, { CSSProperties, FC, PropsWithChildren, ReactNode } from 'react';
import styles from './style.module.scss';
import { combineClassNames } from '../../helpers/utils';

interface Props extends PropsWithChildren<any>{
  header?: string | ReactNode;
  footer?: string | ReactNode;
  className?: string;
  style?: CSSProperties;
}
const Layout: FC<Props> = function(props): JSX.Element {
  const { header, footer, children, className, style } = props;

  return (
    <div className={combineClassNames(styles.layout, className)} style={style}>
      <div className={'header'}>{header}</div>
      <div className={styles.main}>{children}</div>
      <div className={'footer'}>{footer}</div>
    </div>
  );
};

export { Layout };
