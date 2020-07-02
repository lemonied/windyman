import React, { FC } from 'react';
import { Header, Layout } from '../../../components/layout';
import { Icon } from '../../../components/icon';
import './style.scss';

const IconDemo: FC = function(props) {
  return (
    <Layout
      header={
        <Header title={'Icon'} />
      }
    >
      <div className={'icon-demo-wrapper'}>
        <div className={'icon-demo-item'}>
          <Icon type={'loading'} className={'loading-animation'} />
          <span className={'desc'}>Loading</span>
        </div>
        <div className={'icon-demo-item'}>
          <Icon type={'loading-cool'} className={'loading-animation'} />
          <span className={'desc'}>Loading 2</span>
        </div>
      </div>
    </Layout>
  );
};

export { IconDemo };
