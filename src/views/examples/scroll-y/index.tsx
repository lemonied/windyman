import React, { FC, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Map } from 'immutable';
import { post } from '../../../helpers/http';
import { ScrollY, useScrollY } from '../../../components/scroll-y';
import { Subscription } from 'rxjs';
import { Header, Layout } from '../../../components/layout';

const ScrollYDemo: FC = function(props) {

  const recommends: any[] = useSelector((state: Map<string, any>) => state.getIn(['demoState', 'recommends']));
  const dispatch = useDispatch();

  const query = useRef({ currentPage: 1, countsNum: 50 });

  const pageBean = useRef<any>();

  const scroll = useScrollY();

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
        dispatch({ type: 'UPDATE_RECOMMENDS', value: res.result });
      }
      scroll.finishPullUp();
      scroll.finishPullDown();
    });
  }, [dispatch, scroll]);

  const onPullingUp = useCallback(() => {
    if (pageBean.current.totalPage <= pageBean.current.currentPage) {
      return scroll.closePullUp();
    }
    query.current.currentPage += 1;
    getRecommends();
  }, [getRecommends, scroll]);
  const onPullingDown = useCallback(() => {
    query.current.currentPage = 1;
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
    <Layout
      header={
        <Header title={'ScrollY'} />
      }
    >
      <div style={{padding: '10px 0', height: '100%'}}>
        <ScrollY
          onPullingUp={onPullingUp}
          scroll={scroll}
          onPullingDown={onPullingDown}
        >
          <div style={{padding: '0 10px'}}>
            {
              recommends.map((item, key) => (
                <div key={key}>{ item.cand03 }</div>
              ))
            }
          </div>
        </ScrollY>
      </div>
    </Layout>
  );
};

export { ScrollYDemo };
