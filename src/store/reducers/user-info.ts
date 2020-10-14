import { fromJS, Map, Record } from 'immutable';
import { useSelector } from 'react-redux';
import { REMOVE_USER_INFO, SET_USER_INFO, USER_INFO } from '../types';

interface UserInfo {
  status: 0 | 1;
  nick?: string;
}
type StateTypes = Record<UserInfo>;

const defaultState = fromJS({
  status: 0
});

interface Action {
  type: symbol;
  value?: StateTypes & UserInfo
}

export default (state = defaultState, action: Action) => {
  switch (action.type) {
    case SET_USER_INFO:
      return state.merge(Map(action.value as StateTypes));
    case REMOVE_USER_INFO:
      return defaultState;
    default:
      return state;
  }
};

export const useUserInfo = (): StateTypes => {
  return useSelector((state: any) => state.get(USER_INFO));
};
