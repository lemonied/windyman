import React, { FC, PropsWithChildren } from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { Dispatch } from 'redux';

interface Props extends PropsWithChildren<any> {
  recommends: any[];
  setRecommends: (recommends: any[]) => void;
}

const Recommends: FC<Props> = function(props) {
  return (
    <div></div>
  );
}
const mapStateToProps = (state: Map<string, any>) => ({
  recommends: state.getIn(['homeState', 'recommends'])
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  setRecommends: (value: any[]) => {
    dispatch({
      type: 'SET_RECOMMENDS',
      value
    });
  }
});

export const Recommend = connect(mapStateToProps, mapDispatchToProps)(Recommends);
