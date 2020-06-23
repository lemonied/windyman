import React, {FC, useEffect, useState} from 'react';

interface Props {
  load: () => Promise<any>;
}

let cache: any = null;
const AsyncLoad: FC<Props> = function (props): JSX.Element {
  const { load } = props;
  const [ Child, setChild ] = useState<any>(cache);
  useEffect(() => {
    load().then(res => {
      setChild(res);
      cache = res;
    });
  }, [load]);

  if (!Child) {
    return (
      <div>loading...</div>
    );
  }
  return (
    <Child.default />
  );
};

export { AsyncLoad };
