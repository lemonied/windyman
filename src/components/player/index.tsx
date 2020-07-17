import React, { forwardRef, ForwardRefRenderFunction, useCallback, useEffect, useRef, useState } from 'react';
import './style.scss';
import { CSSTransition } from 'react-transition-group';
import { combineClassNames } from '../../common/utils';
import { Progress } from '../progress';

function timeFormat(t = 0) {
  const m = Math.round(t % 60);
  return `${Math.floor(t / 60)}:${m < 10 ? '0' + m : m}`;
}

export interface Song {
  duration: number; // second
  image: string; // image url
  name: string; // song name
  singer: string; // singer name
  url: string; // play url
}
type PlayMode = 'loop' | 'sequence' | 'random';
interface PlayerInstance {

}
interface PlayerProps {
  className?: string;
  song?: Song;
}
const PlayerFc: ForwardRefRenderFunction<PlayerInstance, PlayerProps> = function(props, ref) {
  const { song } = props;
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const playingRef = useRef(false);

  const [ fullScreen, setFullScreen ] = useState(false);
  const [ playing, setPlaying ] = useState(false);
  const [ percent, setPercent ] = useState(0);
  const [ fmtTime, setFmtTime ] = useState('');

  useEffect(() => {
    audioRef.current.autoplay = true;
  }, []);
  useEffect(() => {
    audioRef.current.ontimeupdate = (e: any) => {
      if (song) {
        const time: number = e.target.currentTime;
        setFmtTime(timeFormat(time));
        setPercent(time / song.duration);
      }
    };
    audioRef.current.onplay = () => {
      playingRef.current = true;
      setPlaying(true);
    };
    audioRef.current.onpause = () => {
      playingRef.current = false;
      setPlaying(false);
    };
  }, [song]);
  useEffect(() => {
    if (song) {
      audioRef.current.src = song.url;
      audioRef.current.play().then(() => {
        // playing
      });
    }
  }, [song]);

  const togglePlay = useCallback(() => {
    if (playingRef.current) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().then(() => {
        // playing
      });
    }
  }, []);

  if (!song) {
    return null;
  }
  return (
    <div className={'windy-player-wrapper'}>
      <CSSTransition
        key={'mini'}
        in={!fullScreen}
        timeout={400}
        classNames="mini"
        unmountOnExit
      >
        <div className="mini-player">
          <div
            className="icon"
            onClick={() => setFullScreen(pre => !pre)}
          >
            <img width="40" height="40" src={song.image} className={combineClassNames('play', playing ? null : 'pause')} alt={'icon'} />
          </div>
          <div
            className="text"
            onClick={() => setFullScreen(pre => !pre)}
          >
            <h2 className="name">{song.name}</h2>
            <p className="desc">{song.singer}</p>
          </div>
          <div
            className="control"
            onClick={togglePlay}
          >
            <Progress
              className={'windy-player-progress'}
              percent={percent * 100}
              type={'circle'}
              middle={
                <i className={`icon-mini ${playing ? 'icon-pause-mini' : 'icon-play-mini'}`} />
              }
            />
          </div>
          <div
            className="control"
          >
            <i className="icon-playlist" />
          </div>
        </div>
      </CSSTransition>
    </div>
  );
};
export const Player = forwardRef(PlayerFc);
