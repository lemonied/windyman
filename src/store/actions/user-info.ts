import { Dispatch } from 'redux';
import { fromJS } from 'immutable';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { SET_USER_INFO } from '../types';

export const pullUserInfo = (dispatch: Dispatch) => {
  setTimeout(() => {
    dispatch({
      type: SET_USER_INFO,
      value: fromJS({ status: 1, nick: 'ChenJiYuan' })
    });
  }, 2000);
};

export const useGetUserInfo = () => {
  const dispatch = useDispatch();
  return useCallback(() => {
    pullUserInfo(dispatch);
  }, [dispatch]);
};
