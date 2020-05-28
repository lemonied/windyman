import { Dispatch } from 'redux';
import { fromJS } from 'immutable';

export const getUserInfo = (dispatch: Dispatch): () => void => {
  return () => {
    setTimeout(() => {
      dispatch({
        type: 'SET_USER_INFO',
        value: fromJS({ status: 1, nick: 'ChenJiYuan' })
      });
    }, 2000);
  }
}
