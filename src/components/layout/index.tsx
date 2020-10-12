import React, { CSSProperties, FC, ReactNode } from 'react';
import { combineClassNames } from '../../common/utils';
import './style.scss';

interface Props {
  header?: ReactNode;
  footer?: ReactNode;
  extra?: ReactNode;
  className?: string;
  style?: CSSProperties;
}
const Layout: FC<Props> = function(props) {
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

export { Header } from './header';

export { FixedRouter } from './fixed-router';
