import React, { FC } from 'react';
import { Header, Layout } from '../../../components/layout';
import { Sliders } from '../../../components/slider';

const sliders = [
  "http://y.gtimg.cn/music/photo_new/T015R640x360M101003SgTd53M3fwE.jpg",
  "http://y.gtimg.cn/music/photo_new/T015R640x360M102004XW0TF19O2dq.jpg",
  "http://y.gtimg.cn/music/photo_new/T015R640x360M101000LLc500Renn0.jpg",
  "http://y.gtimg.cn/music/photo_new/T015R640x360M101001vTXNC0bt0fi.jpg",
  "http://y.gtimg.cn/music/photo_new/T015R640x360M101003GKpbq3gpbdC.jpg",
  "http://y.gtimg.cn/music/photo_new/T015R640x360M101003hLYkx3dLRM6.jpg",
  "http://y.gtimg.cn/music/photo_new/T015R640x360M101004ACg6l3ugxSj.jpg",
  "http://y.gtimg.cn/music/photo_new/T015R640x360M101001T8vEM4HsL15.jpg"
];

const SliderDemo: FC = function () {
  return (
    <Layout
      header={<Header title={'Slider'}/>}
    >
      <Sliders
        dot={true}
      >
        {
          sliders.map((item, key) => (
            <img src={item} key={key} alt={'banner'} />
          ))
        }
      </Sliders>
      <div style={{height: 300}} />
      <div>Bottom</div>
    </Layout>
  );
};

export { SliderDemo };
