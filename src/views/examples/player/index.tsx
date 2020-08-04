import React, { FC, useCallback, useState } from 'react';
import { Header, Layout } from '../../../components/layout';
import { Button } from '../../../components/button';
import { get, post } from '../../../helpers/http';
import { Player, Song } from '../../../components/player';

const unescapeHTML = function(lrc: string){
  const t = document.createElement('div');
  t.innerHTML = lrc + '';
  return t.innerText;
};

const song1 = {
  albumid: 6571762,
  albummid: '002fVmqh3CdV7V',
  albumname: '只是太爱你',
  interval: 247,
  songid: 230937674,
  songmid: '0029Trp4461bN9',
  songname: '只是太爱你',
  singer: '丁芙妮'
};

const PlayerDemo: FC = function() {

  const [ song, setSong ] = useState<Song>();
  const [ lyric, setLyric ] = useState();

  const getPlayUrl = useCallback(() => {
    const data = JSON.stringify(
      {
        'req_0': {
          'module': 'vkey.GetVkeyServer',
          'method': 'CgiGetVkey',
          'param': {
            'guid': '7500658880',
            'songmid': [song1.songmid],
            'songtype': [],
            'uin': '0',
            'loginflag': 0,
            'platform': '23',
            'h5to': 'speed'
          }
        }, 'comm': {'uin': 0, 'format': 'json', 'ct': 23, 'cv': 0}
      }
    );
    post(`/cgi-bin/musicu.fcg?_=${Date.now()}`, data).subscribe(res => {
      if (res.code === 0) {
        let url = res.req_0.data;
        url = `${url.sip[0]}${url.midurlinfo[0].purl}`;
        setSong({
          name: song1.songname,
          duration: song1.interval,
          image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${song1.albummid}.jpg?max_age=2592000`,
          singer: song1.singer,
          url
        });
      }
    });
    get(`/lyric/fcgi-bin/fcg_query_lyric.fcg?uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&nobase64=1&musicid=${song1.songid}&songtype=0&_=${Date.now()}`).subscribe(res => {
      // eslint-disable-next-line no-eval
      const lyric = eval(`function MusicJsonCallback(r) {return r}${res}`);
      if (lyric.code === 0) {
        const lrc = unescapeHTML(lyric.lyric);
        setLyric(lrc);
      }
    });
  }, []);

  return (
    <Layout
      header={
        <Header title={'Player'} />
      }
      footer={
        <Player song={song} lyric={lyric} />
      }
    >
      <div style={{padding: 10}}>
        <Button onClick={getPlayUrl} ghost>获取音乐</Button>
      </div>
    </Layout>
  );
};

export { PlayerDemo };
