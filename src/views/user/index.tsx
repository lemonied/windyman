import React, { FC, PropsWithChildren, useEffect, Fragment, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Map } from 'immutable';
import { pullUserInfo } from '../../store/actions/user-info';
import { Link } from 'react-router-dom';
import { modal } from '../../components/modal';

interface Props extends PropsWithChildren<any> {

}
const User: FC<Props> = function(props) {

  const userInfo = useSelector((state: Map<string, any>) => state.get('userInfo'));
  const dispatch = useDispatch();
  const getUserInfo = useCallback(() => {
    pullUserInfo(dispatch);
  }, [dispatch]);

  useEffect(() => {
    setTimeout(getUserInfo, 5000);
  }, [getUserInfo]);
  return (
    <Fragment>
      <div>{ userInfo.get('nick') }</div>
      <Link to={'/'}>首页</Link>
      <button onClick={() => modal.open({ content: '这是一个弹窗' }).subscribe()}>弹窗</button>
    </Fragment>
  );
};

export default User;
