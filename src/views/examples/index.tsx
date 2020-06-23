import React, { FC } from 'react';
import { Header, Layout } from '../../components/layout';
import { Route, Link } from 'react-router-dom';
import { ScrollYDemo } from './scroll-y';
import './reducer';
import './style.scss';
import { FixedRouter } from '../../components/layout/fixed-router';
import { YFormDemo } from './form';
import { ModalDemo } from './modal';
import { ProgressDemo } from './progress';

const Examples: FC<any> = function(): JSX.Element {

  return (
    <Layout
      header={
        <Header title={'组件示例'} />
      }
      extra={
        <FixedRouter defaultPath={'/example'}>
          <Route path={'/example/scroll-y'} component={ScrollYDemo} exact={true} />
          <Route path={'/example/y-form'} component={YFormDemo} exact={true} />
          <Route path={'/example/modal'} component={ModalDemo} exact={true} />
          <Route path={'/example/progress'} component={ProgressDemo} exact={true} />
        </FixedRouter>
      }
    >
      <div className={'demo-content'}>
        <div>1、<Link to={'/example/scroll-y'}>ScrollY</Link></div>
        <div>2、<Link to={'/example/y-form'}>YForm</Link></div>
        <div>3、<Link to={'/example/modal'}>Modal</Link></div>
        <div>4、<Link to={'/example/progress'}>Progress</Link></div>
      </div>
    </Layout>
  );
};

export default Examples;
