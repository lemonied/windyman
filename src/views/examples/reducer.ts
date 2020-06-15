import { Map } from 'immutable';
import { injectReducer } from '../../store/core';

const defaultState: Map<string, any> = Map({
  recommends: []
});

const demoState = (state = defaultState, action: any) => {
  switch (action.type) {
    case 'SET_HOME_STATE':
      return state.merge(action.value);
    case 'SET_RECOMMENDS':
      return state.set('recommends', action.value);
    case 'UPDATE_RECOMMENDS':
      return state.update('recommends', prevValue => prevValue.concat(action.value));
    default:
      return state;
  }
};

injectReducer('demoState', demoState);
