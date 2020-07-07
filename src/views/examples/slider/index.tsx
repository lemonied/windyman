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
      <div style={{padding: 10}}>横向轮播图：</div>
      <Sliders
        dot={true}
      >
        {
          sliders.map((item, key) => (
            <img src={item} key={key} alt={'banner'} />
          ))
        }
      </Sliders>
      <div style={{padding: 10}}>纵向轮播图：</div>
      <div
        style={{
          height: 0,
          padding: 360 / 640 / 2 * 100 + '% 0',
          position: 'relative'
        }}
      >
        <Sliders
          dot={true}
          direction={'y'}
          style={{
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          {
            sliders.map((item, key) => (
              <img src={item} key={key} alt={'banner'} width={'100%'} />
            ))
          }
        </Sliders>
      </div>
    </Layout>
  );
};

export { SliderDemo };
