import React, { CSSProperties, FC, PropsWithChildren, ReactNode } from 'react';
import './style.scss';
import { combineClassNames } from '../../common/utils';

interface Props extends PropsWithChildren<any>{
  header?: string | ReactNode;
  footer?: string | ReactNode;
  extra?: ReactNode;
  className?: string;
  style?: CSSProperties;
}
const Layout: FC<Props> = function(props): JSX.Element {
  const { header, footer, children, className, style, extra } = props;

  return (
    <div className={combineClassNames('windy-layout', className)} style={style}>
      <div className={'header'}>{header}</div>
      <div className={'main'}>{children}</div>
      { extra }
      <div className={'footer'}>{footer}</div>
    </div>
  );
};

export { Layout };
