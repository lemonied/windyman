import { Dispatch } from 'redux';
import { fromJS } from 'immutable';

export const pullUserInfo = (dispatch: Dispatch) => {
  setTimeout(() => {
    dispatch({
      type: 'SET_USER_INFO',
      value: fromJS({ status: 1, nick: 'ChenJiYuan' })
    });
  }, 2000);
}
