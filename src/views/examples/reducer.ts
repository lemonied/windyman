import { Map, Record } from 'immutable';
import { injectReducer } from '../../store/core';
import { useSelector } from 'react-redux';

interface Demo {
  recommends: any[];
}
type DemoTypes = Record<Demo>;

const defaultState = Map({
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

export const useDemoStates = (): DemoTypes => {
  return useSelector((state: any) => state.get('demoState'));
};
export const useRecommends = (): Demo['recommends'] => {
  return useSelector((state: any) => state.getIn(['demoState', 'recommends']));
};

injectReducer('demoState', demoState);
