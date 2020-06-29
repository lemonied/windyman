import React, { FC, useEffect, useState } from 'react';
import { progress } from '../progress';

interface Props {
  load: () => Promise<any>;
}

let cache: any = null;
const AsyncLoad: FC<Props> = function (props): JSX.Element {
  const { load } = props;
  const [ Child, setChild ] = useState<any>(cache);
  useEffect(() => {
    const pro = progress.open();
    setTimeout(() => pro.set(100));
    load().then(res => {
      setChild(res);
      pro.destroy();
      cache = res;
    });
    return () => {
      progress.destroyAll();
    };
  }, [load]);

  if (!Child) {
    return (
      <div style={{padding: 8}}>loading...</div>
    );
  }
  return (
    <Child.default />
  );
};

export { AsyncLoad };
