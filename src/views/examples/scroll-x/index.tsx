import React, { FC, useEffect } from 'react';
import { Header, Layout } from '../../../components/layout';
import { ScrollX, useScrollX } from '../../../components/scroll-x';
import { Icon } from '../../../components/icon';
import './style.scss';

const list = [{
  icon: 'info-circle'
}, {
  icon: 'warning-circle'
}, {
  icon: 'arrow-right'
}, {
  icon: 'check'
}, {
  icon: 'woman'
}, {
  icon: 'man'
}, {
  icon: 'loading'
}, {
  icon: 'loading-cool'
}, {
  icon: 'eye'
}, {
  icon: 'like'
}, {
  icon: 'like-filled'
}, {
  icon: 'fire'
}];

const ScrollXDemo: FC = function() {
  const scroll = useScrollX();
  useEffect(() => {
    console.log(scroll);
  }, [scroll]);

  return (
    <Layout
      header={<Header title={'ScrollX'} />}
    >
      <ScrollX
        dot={true}
        style={{
          background: '#f3f3f3'
        }}
        scroll={scroll}
      >
        <div
          className={'scroll-x-demo-wrapper'}
        >
          {
            list.map((item, key) => (
              <div key={key} className={'icon-wrapper'}>
                <Icon type={item.icon} />
              </div>
            ))
          }
        </div>
      </ScrollX>
    </Layout>
  );
};

export { ScrollXDemo };
