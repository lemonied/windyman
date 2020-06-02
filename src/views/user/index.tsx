import React, { FC, PropsWithChildren, useEffect, Fragment, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Map } from 'immutable';
import { pullUserInfo } from '../../store/actions/user-info';
import { Link } from 'react-router-dom';
import { modal } from '../../components/modal';
import { Sliders } from '../../components/slider';
import { usePrevious } from '../../hook/common';

interface Props extends PropsWithChildren<any> {

}
const User: FC<Props> = function(props) {

  const [count, setCount] = useState<number>(0);
  const prevCount = usePrevious(count);

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
      <button onClick={() => modal.confirm({ content: '这是一个弹窗' }).subscribe()}>弹窗</button>
      <button onClick={e => setCount(prev => prev + 1)}>计数</button>
      <div>prev:{prevCount}，current:{count}</div>
      <Sliders autoplay={false}>
        <div style={{height: 200, background: 'red'}}>123</div>
        <div style={{height: 200, background: 'yellow'}}>456</div>
      </Sliders>
    </Fragment>
  );
};

export default User;
