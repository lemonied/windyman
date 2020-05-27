import React, {FC, useEffect, useState} from 'react';

interface Props {
  load: () => Promise<any>;
}

const AsyncLoad: FC<Props> = function (props): JSX.Element {
  const { load } = props;
  const [ Child, setChild ] = useState<any>(null);
  useEffect(() => {
    load().then(res => {
      setChild(res);
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
}

export { AsyncLoad }
