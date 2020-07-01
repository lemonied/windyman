import React, { FC, ReactNode } from 'react';
import { combineClassNames } from '../../common/utils';
import { Icon } from '../icon';
import './style.scss';
import { LinkProps, Link } from 'react-router-dom';

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


const Container: FC<{ link?: LinkProps['to'], className?: string, onClick?: ItemProps['onClick'] }> = (props) => {
  const { link, children, className, onClick } = props;

  if (typeof link !== 'undefined') {
    return (
      <Link to={link} className={className} onClick={onClick}>{children}</Link>
    );
  }
  return (
    <div className={className} onClick={onClick}>{children}</div>
  );
};
interface ItemProps {
  arrow?: 'horizontal' | 'empty' | null;
  prefix?: ReactNode;
  extra?: ReactNode;
  onClick?: (e: any) => void;
  link?: LinkProps['to'];
}
const Item: FC<ItemProps> = function(props) {
  const { arrow, prefix, children, extra , onClick, link } = props;

  return (
    <Container link={link} className={combineClassNames('windy-list-item', arrow ? 'has-arrow' : '')} onClick={onClick}>
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
