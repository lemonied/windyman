import React, { FC, ReactNode, useCallback, useMemo } from 'react';
import { Icon } from '../icon';
import { combineClassNames } from '../../common/utils';
import './style.scss';

interface ButtonProps {
  type?: 'primary' | 'warn' | 'danger' | 'default';
  disabled?: boolean;
  onClick?(e: React.MouseEvent): void;
  loading?: boolean;
  ghost?: boolean;
  prefix?: ReactNode;
  after?: ReactNode;
}
const Button: FC<ButtonProps> = function(props) {
  const { children, type = 'plain', disabled, onClick, loading, ghost, prefix, after } = props;
  const typeClass = useMemo(() => {
    switch (type) {
      case 'primary':
        return 'windy-primary-btn';
      case 'warn':
        return 'windy-warn-btn';
      case 'danger':
        return 'windy-danger-btn';
      default:
        return 'windy-default-btn';
    }
  }, [type]);
  const handleOnClick = useCallback((e: React.MouseEvent) => {
    if (loading || disabled) {
      return;
    }
    if (typeof onClick === 'function') {
      onClick(e);
    }
  }, [onClick, loading, disabled]);

  return (
    <button
      disabled={disabled}
      className={
        combineClassNames(
          'windy-button',
          typeClass,
          disabled ? 'windy-disabled-btn' : null,
          loading ? 'windy-loading-btn' : null,
          ghost ? 'windy-btn-ghost' : null
        )
      }
      onClick={handleOnClick}
    >
      {
        loading ?
          <Icon type={'loading'} className={'windy-btn-loading'} /> :
          null
      }
      {prefix}
      <span>{children}</span>
      {after}
    </button>
  );
};

export { Button };
