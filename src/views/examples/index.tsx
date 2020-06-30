import React, { FC } from 'react';
import { Header, Layout } from '../../components/layout';
import { Route } from 'react-router-dom';
import { ScrollYDemo } from './scroll-y';
import './reducer';
import './style.scss';
import { FixedRouter } from '../../components/layout/fixed-router';
import { YFormDemo } from './form';
import { ModalDemo } from './modal';
import { ProgressDemo } from './progress';
import { Item, List } from '../../components/list';

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
        <List>
          <Item link={'/example/scroll-y'} arrow={'horizontal'} extra={'滚动容器'}>ScrollY</Item>
          <Item link={'/example/y-form'} arrow={'horizontal'} extra={'表单控件'}>YForm</Item>
          <Item link={'/example/modal'} arrow={'horizontal'} extra={'弹窗'}>Modal</Item>
          <Item link={'/example/progress'} arrow={'horizontal'} extra={'进度条'}>Progress</Item>
        </List>
      </div>
    </Layout>
  );
};

export default Examples;
