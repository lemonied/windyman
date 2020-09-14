import { useDispatch } from 'react-redux';
import { useCallback } from 'react';

export const useSetRecommends = () => {
  const dispatch = useDispatch();
  return useCallback((values: any[]) => {
    dispatch({ type: 'SET_RECOMMENDS', value: values });
  }, [dispatch]);
};
export const useUpdateRecommends = () => {
  const dispatch = useDispatch();
  return useCallback((values: any[]) => {
    dispatch({ type: 'UPDATE_RECOMMENDS', value: values });
  }, [dispatch]);
};
