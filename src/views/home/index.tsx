import React from 'react';
import { ScrollY } from '../../components/scroll-y';

function Home() {
  return (
    <div
      style={{
        height: 200,
        overflow: 'hidden',
        background: '#f3f3f3'
      }}
    >
      <ScrollY>
        {
          new Array(10).fill(1).map((val, key) => (
            <p key={key}>val:啊啊啊啊啊啊啊</p>
          ))
        }
      </ScrollY>
    </div>
  );
}

export default Home;
