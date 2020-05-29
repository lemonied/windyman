import React, { FC, PropsWithChildren, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Map } from 'immutable';
import { post } from '../../../helpers/http';
import { ScrollY, Instance } from '../../../components/scroll-y';
import { Subscription } from 'rxjs';

interface Props extends PropsWithChildren<any> {

}

const Recommends: FC<Props> = function(props) {

  const recommends: any[] = useSelector((state: Map<string, any>) => state.getIn(['homeState', 'recommends']));
  const dispatch = useDispatch();

  const query = useRef({ currentPage: 1, countsNum: 50 });

  const pageBean = useRef<any>();

  const scroll = useRef<Instance>();

  const subscribe = useRef<Subscription>();

  const getRecommends = useCallback(() => {
    subscribe.current?.unsubscribe();
    subscribe.current = post('/service/business/sms/sms/getContentList', Object.assign({
      plateform: 1,
      rowsNum: 20,
      channel_code: 'ZXDT'
    }, query)).subscribe(res => {
      pageBean.current = res.pageBean;
      if (query.current.currentPage === 1) {
        dispatch({ type: 'SET_RECOMMENDS', value: res.result });
      } else {
        dispatch({ type: 'UPDATE_RECOMMENDS', value: res.result })
      }
      scroll.current?.finishPullUp();
    });
  }, [dispatch]);

  const onPullingUp = useCallback(() => {
    if (pageBean.current.totalPage <= pageBean.current.currentPage) {
      return scroll.current?.closePullUp();
    }
    query.current.currentPage += 1;
    getRecommends();
  }, [getRecommends]);

  // init
  useEffect(() => {
    getRecommends();
  }, [getRecommends]);

  // destroy
  useEffect(() => {
    return () => subscribe.current?.unsubscribe();
  }, []);

  return (
    <ScrollY
      onPullingUp={onPullingUp}
      getInstance={e => scroll.current = e}
    >
      {
        recommends.map((item, key) => (
          <div key={key}>{ item.cand03 }</div>
        ))
      }
    </ScrollY>
  );
}

export { Recommends };
