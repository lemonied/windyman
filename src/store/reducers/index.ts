import { combineReducers } from 'redux-immutable';
import userInfo from './user-info';
import { ReducersMapObject } from 'redux';

export const originalReducers: ReducersMapObject = {
  userInfo
};

export default combineReducers({ ...originalReducers });
