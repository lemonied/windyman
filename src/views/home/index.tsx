import React, { FC, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { Header, Layout } from '../../components/layout';

interface Props extends PropsWithChildren<any> {}

const Home: FC<Props> = function(props): JSX.Element {
  return (
    <Layout
      header={
        <Header title={'快乐风男'} left={null} />
      }
    >
      <div
        style={{
          padding: '10px 10px'
        }}
      >
        <Link to={'/example'}>组件示例</Link>
      </div>
    </Layout>
  );
};

export default Home;
