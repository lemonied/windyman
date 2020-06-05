import React, { FC, PropsWithChildren, useEffect, Fragment, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Map } from 'immutable';
import { pullUserInfo } from '../../store/actions/user-info';
import { Link } from 'react-router-dom';
import { modal } from '../../components/modal';
import { Sliders } from '../../components/slider';
import { usePrevious } from '../../hook/common';
import { Input } from '../../components/input';

interface Props extends PropsWithChildren<any> {

}
const User: FC<Props> = function(props) {

  const [count, setCount] = useState<number>(0);
  const prevCount = usePrevious(count);

  const [count2, setCount2] = useState<number>(0);
  const prevCount2 = usePrevious(count2);
  const [selectedList, setSelectedList] = useState(
    [{
      value: '1',
      name: '第一项'
    }, {
      value: '2',
      name: '第二项'
    }, {
      value: '3',
      name: '第三项'
    }, {
      value: '4',
      name: '第四项',
      disabled: true
    }, {
      value: '5',
      name: '第五项'
    }]
  );

  const userInfo = useSelector((state: Map<string, any>) => state.get('userInfo'));
  const dispatch = useDispatch();
  const getUserInfo = useCallback(() => {
    pullUserInfo(dispatch);
  }, [dispatch]);

  useEffect(() => {
    setTimeout(getUserInfo, 5000);
  }, [getUserInfo]);
  useEffect(() => {
    setTimeout(() => {
      setSelectedList([{
        value: '111',
        name: '哈'
      }, {
        value: '222',
        name: '哈哈'
      }, {
        value: '333',
        name: '哈哈哈'
      }]);
    }, 5000);
    setTimeout(() => {
      setPickerValue('222');
    }, 7000);
  }, []);
  const [pickerValue, setPickerValue] = useState('1');
  const onChange = useCallback((value) => {
    console.log(value);
    setPickerValue(value);
  }, []);
  return (
    <Fragment>
      <div>用户：{ userInfo.get('nick') }</div>
      <Link to={'/'}>首页</Link>
      <button onClick={() => modal.confirm({ content: '这是一个弹窗' }).subscribe()}>弹窗</button>
      <div>
        <button onClick={e => setCount(prev => prev + 1)}>计数</button>
        <div>prev:{prevCount}，current:{count}</div>
      </div>
      <div>
        <button onClick={e => setCount2(prev => prev + 1)}>计数2</button>
        <div>prev:{prevCount2}，current:{count2}</div>
      </div>
      <Sliders autoplay={false}>
        <div style={{height: 200, background: 'red'}}>123</div>
        <div style={{height: 200, background: 'yellow'}}>456</div>
      </Sliders>
      <Input type={'picker'} data={selectedList} placeholder={'请选择XXX'} onChange={onChange} value={pickerValue} />
    </Fragment>
  );
};

export default User;
