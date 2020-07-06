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
import { IconDemo } from './icon';
import { SliderDemo } from './slider';
import { ScrollXDemo } from './scroll-x';
import { ButtonDemo } from './button';

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
          <Route path={'/example/icon'} component={IconDemo} exact={true} />
          <Route path={'/example/slider'} component={SliderDemo} exact={true} />
          <Route path={'/example/scroll-x'} component={ScrollXDemo} exact={true} />
          <Route path={'/example/button'} component={ButtonDemo} exact={true} />
        </FixedRouter>
      }
    >
      <div className={'demo-content'}>
        <List>
          <Item link={'/example/scroll-y'} arrow={'horizontal'} extra={'滚动容器'}>ScrollY</Item>
          <Item link={'/example/scroll-x'} arrow={'horizontal'} extra={'横向滚动'}>ScrollX</Item>
          <Item link={'/example/y-form'} arrow={'horizontal'} extra={'表单控件'}>YForm</Item>
          <Item link={'/example/modal'} arrow={'horizontal'} extra={'弹窗'}>Modal</Item>
          <Item link={'/example/progress'} arrow={'horizontal'} extra={'进度条'}>Progress</Item>
          <Item link={'/example/icon'} arrow={'horizontal'} extra={'图标'}>Icon</Item>
          <Item link={'/example/slider'} arrow={'horizontal'} extra={'轮播图'}>Slider</Item>
          <Item link={'/example/button'} arrow={'horizontal'} extra={'按钮'}>Button</Item>
        </List>
      </div>
    </Layout>
  );
};

export default Examples;
