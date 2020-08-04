import React, { useCallback, useEffect, useState } from 'react';
import { Header, Layout } from '../../../components/layout';
import { progressBar, LineProgress, CircleProgress } from '../../../components/progress';
import { Button } from '../../../components/button';

const ProgressDemo = function():JSX.Element {
  const [percent, setPercent] = useState(50);

  const changePercent = useCallback((add?: boolean) => {
    if (add) {
      setPercent(val => Math.min(100, val + 5));
    } else {
      setPercent(val => Math.max(0, val - 5));
    }
  }, []);

  useEffect(() => {
    return () => {
      progressBar.destroyAll();
    };
  }, []);

  return (
    <Layout
      header={
        <Header title={'进度条'} />
      }
    >
      <div style={{padding: 15}}>
        <div>
          线形 Line：
        </div>
        <LineProgress percent={percent} onChange={(e: number) => setPercent(e)} />
        <div>
          环形 Circle：
        </div>
        <div
          style={{
            width: '40%',
            padding: '15px 0',
            margin: '0 auto'
          }}
        >
          <CircleProgress percent={percent} />
        </div>
        <div style={{textAlign: 'center'}}>
          <Button onClick={e => changePercent(false)} ghost type={'primary'}>减少 -5%</Button>
          &nbsp;
          <Button onClick={e => changePercent(true)} ghost type={'primary'}>增加 +5%</Button>
        </div>
        <div style={{padding: '20px 0 10px 0'}}>页面顶部进度（用于页面加载等）：</div>
        <div>
          <Button type={'primary'} onClick={e => progressBar.open({ height: 4, defaultPercent: 10 })}>显示</Button>
          &nbsp;
          <Button type={'primary'} onClick={e => progressBar.set(50)} ghost>设置为50%</Button>
          &nbsp;
          <Button type={'default'} onClick={e => progressBar.set(100)} ghost>设置为100%</Button>
        </div>
        <div style={{padding: '10px 0'}}>
          <Button type={'danger'} onClick={e => progressBar.destroyAll()}>关闭 Progress Bar</Button>
        </div>
      </div>
    </Layout>
  );
};

export { ProgressDemo };
