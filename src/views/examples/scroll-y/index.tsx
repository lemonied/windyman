import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Map } from 'immutable';
import { post } from '../../../helpers/http';
import { ScrollY, useScrollY } from '../../../components/scroll-y';
import { Subscription } from 'rxjs';
import { Header, Layout } from '../../../components/layout';
import { Loading } from '../../../components/loading';

const ScrollYDemo: FC = function(props) {

  const [loading, setLoading] = useState(false);

  const recommends: any[] = useSelector((state: Map<string, any>) => state.getIn(['demoState', 'recommends']));
  const dispatch = useDispatch();

  const query = useRef({ currentPage: 1, rowsNum: 30 });

  const pageBean = useRef<any>();

  const scroll = useScrollY();

  const subscribe = useRef<Subscription>();

  const getRecommends = useCallback(() => {
    subscribe.current?.unsubscribe();
    if (query.current.currentPage === 1) {
      setLoading(true);
    }
    subscribe.current = post('/service/business/sms/sms/getContentList', Object.assign({
      plateform: 1,
      countsNum: 50,
      channel_code: 'ZXDT'
    }, query.current)).subscribe(res => {
      pageBean.current = res.pageBean;
      if (query.current.currentPage === 1) {
        setLoading(false);
        scroll.openPullUp();
        dispatch({ type: 'SET_RECOMMENDS', value: res.result });
      } else {
        dispatch({ type: 'UPDATE_RECOMMENDS', value: res.result });
      }
      query.current.currentPage += 1;
      scroll.finishPullUp();
      scroll.finishPullDown();
    });
  }, [dispatch, scroll]);

  const onPullingUp = useCallback(() => {
    if (pageBean.current && pageBean.current.totalPage <= pageBean.current.currentPage) {
      return scroll.closePullUp();
    }
    getRecommends();
  }, [getRecommends, scroll]);
  // reload
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
      {
        loading && !recommends.length ?
          <Loading title={'加载中...'} /> :
          null
      }
      <div style={{height: '100%'}}>
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
