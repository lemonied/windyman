import {fromJS} from 'immutable';

const defaultState = fromJS({
  status: 0
});

interface Action {
  type: 'SET_USER_INFO' | 'REMOVE_USER_INFO';
  value?: any
}

export default (state = defaultState, action: Action) => {
  switch (action.type) {
    case 'SET_USER_INFO':
      return state.merge(action.value);
    case 'REMOVE_USER_INFO':
      return defaultState;
    default:
      return state;
  }
};
