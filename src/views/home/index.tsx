import React, { FC, PropsWithChildren } from 'react';
import { Recommends } from './recommends';
import { Link } from 'react-router-dom';
import './reducer';
import { Map } from 'immutable';
import { useSelector } from 'react-redux';
import { Layout } from '../../components/layout';

interface Props extends PropsWithChildren<any> {}

const Home: FC<Props> = function(props): JSX.Element {

  const userInfo = useSelector((state: Map<string, any>) => state.get('userInfo'));

  return (
    <Layout
      footer={
        <Link to={'/user'}>昵称：{ userInfo.get('nick') }</Link>
      }
    >
      <Recommends />
    </Layout>
  );
};

export default Home;
