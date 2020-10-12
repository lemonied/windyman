import React, { CSSProperties, FC, ReactNode } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { Icon } from '../icon';
import { combineClassNames } from '../../common/utils';
import './style.scss';

interface ListProps {
  className?: string;
}
const List: FC<ListProps> = function(props) {
  const { children, className } = props;
  return (
    <div className={combineClassNames('windy-list', className)}>{ children }</div>
  );
};
export { List };

interface ContainerProps {
  link?: LinkProps['to'];
  className?: string;
  onClick?: ItemProps['onClick'];
  style?: ItemProps['style'];
}
const Container: FC<ContainerProps> = (props) => {
  const { link, children, className, onClick, style } = props;

  if (typeof link !== 'undefined') {
    return (
      <Link to={link} className={className} onClick={onClick} style={style}>{children}</Link>
    );
  }
  return (
    <div className={className} onClick={onClick} style={style}>{children}</div>
  );
};
interface ItemProps {
  arrow?: 'horizontal' | 'empty' | null;
  prefix?: ReactNode;
  extra?: ReactNode;
  onClick?: (e: any) => void;
  link?: LinkProps['to'];
  style?: CSSProperties;
  className?: string;
}
const Item: FC<ItemProps> = function(props) {
  const { arrow, prefix, children, extra , onClick, link, style, className } = props;

  return (
    <Container
      link={link}
      className={
        combineClassNames(
          'windy-list-item',
          arrow ? 'has-arrow' : '',
          className
        )
      }
      onClick={onClick}
      style={style}
    >
      {
        prefix ?
          <div className={'windy-item-prefix'}>{ prefix }</div> :
          null
      }
      <div className={'windy-item-content'}>{ children }</div>
      {
        extra ?
          <div className={'windy-item-extra'}>{ extra }</div> :
          null
      }
      {
        arrow ?
          <div className={'windy-item-after'}>
            <Icon type={'arrow-right'} className={'item-after-right'} />
          </div> :
          null
      }
    </Container>
  );
};
export { Item };
