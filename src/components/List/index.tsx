import React, { FC, ReactNode } from 'react';
import { combineClassNames } from '../../common/utils';
import { Icon } from '../icon';
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

interface ItemProps {
  arrow?: 'horizontal' | 'empty' | null;
  prefix?: string | ReactNode;
  extra?: string | ReactNode;
  onClick?: (e: any) => void;
}
const Item: FC<ItemProps> = function(props) {
  const { arrow, prefix, children, extra , onClick} = props;

  return (
    <div className={combineClassNames('windy-list-item', arrow ? 'has-arrow' : '')} onClick={onClick}>
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
    </div>
  );
};
export { Item };
