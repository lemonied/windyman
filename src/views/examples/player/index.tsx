import React, { FC, useCallback, useEffect, useState } from 'react';
import { Header, Layout } from '../../../components/layout';
import { Button } from '../../../components/button';
import { get, jsonp, post } from '../../../helpers/http';
import { Player, PlayModes, Song } from '../../../components/player';

const unescapeHTML = function(lrc: string){
  const t = document.createElement('div');
  t.innerHTML = lrc + '';
  return t.innerText;
};

const PlayerDemo: FC = function() {

  const [ song, setSong ] = useState<Song>();
  const [ lyric, setLyric ] = useState();
  const [ list, setList ] = useState<Song[]>([]);

  const [ remoteList, setRemoteList ] = useState<any[]>([]);

  useEffect(() => {
    jsonp(`https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&topid=60&needNewCode=1&uin=0&tpl=3&page=detail&type=top&platform=h5&_=${Date.now()}`, {
      param: 'jsonpCallback'
    }).subscribe((res) => {
      if (res.code === 0) {
        const items = res.songlist.map((item: any) => {
          item = item.data;
          return {
            albumid: item.albumid,
            albummid: item.albummid,
            albumname: item.albumname,
            interval: item.interval,
            songid: item.songid,
            songmid: item.songmid,
            songname: item.songname,
            singer: item.singer.map((v: any) => v.name).join(',')
          };
        });
        setRemoteList(items);
        setList(items.map((v: any) => {
          return {
            name: v.songname,
            duration: v.interval,
            image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${v.albummid}.jpg?max_age=2592000`,
            singer: v.singer
          };
        }));
      }
    });
  }, []);

  const getPlayInfo = useCallback((current: any): Promise<void> => {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(
        {
          'req_0': {
            'module': 'vkey.GetVkeyServer',
            'method': 'CgiGetVkey',
            'param': {
              'guid': '7500658880',
              'songmid': [current.songmid],
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
          const index = remoteList.indexOf(current);
          if (index > -1) {
            setSong(Object.assign(list[index], { url }));
          }
        }
        resolve();
      }, () => {
        resolve();
      });
      get(`/lyric/fcgi-bin/fcg_query_lyric.fcg?uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&nobase64=1&musicid=${current.songid}&songtype=0&_=${Date.now()}`).subscribe(res => {
        // eslint-disable-next-line no-eval
        const lyric = eval(`function MusicJsonCallback(r) {return r}${res}`);
        if (lyric.code === 0) {
          const lrc = unescapeHTML(lyric.lyric);
          setLyric(lrc);
        }
      });
    });
  }, [list, remoteList]);

  const play = useCallback(() => {
    if (!song && remoteList.length) {
      getPlayInfo(remoteList[0]);
    }
  }, [song, remoteList, getPlayInfo]);

  const onChange = useCallback((song: Song, index: number, playMode: PlayModes): Promise<void> => {
    return getPlayInfo(remoteList[index]);
  }, [remoteList, getPlayInfo]);

  return (
    <Layout
      header={
        <Header title={'Player'} />
      }
      footer={
        <Player song={song} lyric={lyric} list={list} onChange={onChange} />
      }
    >
      <div style={{padding: 10}}>
        <Button onClick={play} ghost>播放音乐</Button>
      </div>
    </Layout>
  );
};

export { PlayerDemo };
