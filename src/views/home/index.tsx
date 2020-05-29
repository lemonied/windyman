import React, { FC, Fragment, PropsWithChildren } from 'react';
import { Recommends } from './recommends';
import { Link } from 'react-router-dom';
import './reducer';
import { Map } from 'immutable';
import { useSelector } from 'react-redux';

interface Props extends PropsWithChildren<any> {
  userInfo: Map<string, any>;
}

const Home: FC<Props> = function(props): JSX.Element {

  const userInfo = useSelector((state: Map<string, any>) => state.get('userInfo'));

  return (
    <Fragment>
      <div
        style={{
          height: '100%',
          overflow: 'hidden',
          background: '#f3f3f3'
        }}
      >
        <Recommends />
      </div>
      <Link to={'/user'}>{ userInfo.get('nick') }</Link>
    </Fragment>
  );
};

export default Home;
