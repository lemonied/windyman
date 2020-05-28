import React, { FC, PropsWithChildren, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { Dispatch } from 'redux';
import { getUserInfo } from '../../store/actions/user-info';
import { Link } from 'react-router-dom';

interface Props extends PropsWithChildren<any> {
  userInfo: Map<string, any>;
  getUserInfo: () => void;
}
const User: FC<Props> = function(props) {
  const { userInfo, getUserInfo } = props;
  useEffect(() => {
    setTimeout(getUserInfo, 5000);
  }, [getUserInfo]);
  return (
    <Fragment>
      <div>{ userInfo.get('nick') }</div>
      <Link to={'/'}>首页</Link>
    </Fragment>
  );
};

const mapStateToProps = (state: Map<string, any>) => ({
  userInfo: state.get('userInfo')
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  getUserInfo: getUserInfo(dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(User);
