import React, { FC, Fragment, PropsWithChildren } from 'react';
import { ScrollY } from '../../components/scroll-y';
import { Recommend } from './recommends';
import { Link } from 'react-router-dom';
import './reducer';
import { Map } from 'immutable';
import { connect } from 'react-redux';

interface Props extends PropsWithChildren<any> {
  userInfo: Map<string, any>;
}

const Home: FC<Props> = function(props): JSX.Element {
  const { userInfo } = props;
  return (
    <Fragment>
      <div
        style={{
          height: 200,
          overflow: 'hidden',
          background: '#f3f3f3'
        }}
      >
        <ScrollY>
          {
            new Array(10).fill(1).map((val, key) => (
              <p key={key}>val:啊啊啊啊啊啊啊</p>
            ))
          }
        </ScrollY>
      </div>
      <Recommend />
      <Link to={'/user'}>{ userInfo.get('nick') }</Link>
    </Fragment>
  );
};
const mapStateToProps = (state: Map<string, any>) => ({
  userInfo: state.get('userInfo')
});

export default connect(mapStateToProps)(Home);
