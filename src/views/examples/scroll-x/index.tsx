import React, { FC } from 'react';
import { Header, Layout } from '../../../components/layout';
import { ScrollX } from '../../../components/scroll-x';

const ScrollXDemo: FC = function() {
  return (
    <Layout
      header={<Header title={'ScrollX'} />}
    >
      <ScrollX
        dot={true}
        style={{
          background: '#f3f3f3'
        }}
      >
        <div
          style={{
            width: '200%',
            padding: 10
          }}
        >asdqweqfffffffffffffffffffffffsadsdssgeagjkehrngiolehngiejnhargloei</div>
      </ScrollX>
    </Layout>
  );
};

export { ScrollXDemo };
