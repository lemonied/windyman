import { DefaultRootState } from 'react-redux';
import { UserInfo } from '../store/reducers/user-info';
import { Record } from 'immutable';

interface InitState {
  userInfo: Record<UserInfo>;
  [prop: string]: any;
}

declare global {}
declare module 'react-redux' {
  export interface DefaultRootState extends Record<InitState>{}
}
