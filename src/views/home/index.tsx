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
        <div style={{textAlign: 'center'}}>
          <img
            src={process.env.PUBLIC_URL + '/yasuo.jpg'}
            alt="yasuo"
            style={{width: '50%', margin: '10px 0'}}
          />
          <div>
            <Link to={'/example'}>组件示例</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
