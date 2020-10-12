import React, { FC } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Switch, useLocation } from 'react-router-dom';
import { combineClassNames } from '../../../common/utils';
import './style.scss';

interface FixedRouterProps {
  defaultPath: string;
}
const FixedRouter: FC<FixedRouterProps> = function(props) {
  const { children, defaultPath } = props;
  const location = useLocation();
  return (
    <TransitionGroup>
      <CSSTransition
        key={location.key}
        timeout={300}
        classNames={'windy-slide'}
        unmountOnExit
      >
        <div className={combineClassNames('windy-fixed-router', location.pathname === defaultPath ? 'windy-fixed-router-exited' : null)}>
          <Switch location={location}>{children}</Switch>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export { FixedRouter };
