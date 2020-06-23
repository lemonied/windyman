import React, { useCallback, useState } from 'react';
import { Header, Layout } from '../../../components/layout';
import { Progress } from '../../../components/progress';

const ProgressDemo = function():JSX.Element {
  const [percent, setPercent] = useState(50);

  const changePercent = useCallback((add?: boolean) => {
    if (add) {
      setPercent(val => Math.min(100, val + 5));
    } else {
      setPercent(val => Math.max(0, val - 5));
    }
  }, []);

  return (
    <Layout
      header={
        <Header title={'进度条'} />
      }
    >
      <div style={{padding: 15}}>
        <Progress percent={percent} />
        <div
          style={{
            width: '40%',
            padding: '15px 0'
          }}
        >
          <Progress type={'circle'} percent={percent} />
        </div>
        <div>
          <button onClick={e => changePercent(false)}>-</button>
          &nbsp;
          <button onClick={e => changePercent(true)}>+</button>
        </div>
      </div>
    </Layout>
  );
};

export { ProgressDemo };
