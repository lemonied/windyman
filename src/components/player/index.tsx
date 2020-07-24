import React, { forwardRef, ForwardRefRenderFunction, useCallback, useEffect, useRef, useState } from 'react';
import './style.scss';
import { CSSTransition } from 'react-transition-group';
import { combineClassNames } from '../../common/utils';
import { Progress } from '../progress';
import { Icon } from '../icon';
import { ScrollY } from '../scroll-y';
import { LyricLine } from './lyric';

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
type PlayModes = 'loop' | 'sequence' | 'random';
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
  const [ totalTime, setTotalTime ] = useState('');
  const [ currentLyric, setCurrentLyric ] = useState('');
  const [ lyricLines, setLyricLines ] = useState<LyricLine[]>([]);
  const [ currentLine, setCurrentLine ] = useState<number>(0);
  const [ currentShow, setCurrentShow ] = useState<'cd' | 'lyric'>('cd');
  const [ playMode, setPlayMode ] = useState<PlayModes>('sequence');

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
    setTotalTime(timeFormat(song?.duration));
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
  const toggleFullScreen = useCallback(() => {
    setFullScreen(pre => !pre);
  }, []);
  const middleTouchStart = useCallback(() => {}, []);
  const middleTouchMove = useCallback(() => {}, []);
  const middleTouchEnd = useCallback(() => {}, []);

  const changeMode = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const playModes: PlayModes[] = ['sequence', 'random', 'loop'];
    setPlayMode(prevState => {
      const index = (playModes.indexOf(prevState) + 1) % playModes.length;
      return playModes[index];
    });
  }, []);

  const onEnter = useCallback(() => {}, []);
  const onAfterEnter = useCallback(() => {}, []);
  const onLeave = useCallback(() => {}, []);
  const onAfterLeave = useCallback(() => {}, []);

  if (!song) {
    return null;
  }
  return (
    <div className={'windy-player-wrapper'}>
      <CSSTransition
        in={fullScreen}
        timeout={400}
        classNames="normal"
        unmountOnExit
        key={'full'}
        onEnter={onEnter}
        onEntered={onAfterEnter}
        onExit={onLeave}
        onExited={onAfterLeave}
      >
        <div className="normal-player">
          <div className="background">
            <img width="100%" height="100%" src={song.image} alt={'song'} />
          </div>
          <div className="top">
            <div className="back" onClick={toggleFullScreen}>
              <Icon type={'back'} className={'icon-back'} />
            </div>
            <h1 className="title">{song.name}</h1>
            <h2 className="subtitle">{song.singer}</h2>
          </div>
          <div
            className="middle"
            onTouchStart={middleTouchStart}
            onTouchMove={middleTouchMove}
            onTouchEnd={middleTouchEnd}
          >
            <div className="middle-l">
              <div className="cd-wrapper">
                <div className={`cd play${playing ? '' : ' pause'}`}>
                  <img className="image" src={song.image} alt={'song'} />
                </div>
              </div>
              <div
                className="playing-lyric-wrapper"
                style={{
                  margin: `${(document.body.clientHeight - 80 - 170 - document.body.clientWidth * 0.8) / 2}px auto 0 auto`
                }}
              >
                <div className="playing-lyric" >{currentLyric}</div>
              </div>
            </div>
            <ScrollY
              className="middle-r"
            >
              <div className="lyric-wrapper">
                {
                  lyricLines.map((item, key) => (
                    <p className={`text${currentLine === key ? ' current' : ''}`} key={key}>{item.txt}</p>
                  ))
                }
              </div>
            </ScrollY>
          </div>
          <div className="bottom">
            <div className="dot-wrapper">
              <span className={combineClassNames('dot', currentShow === 'cd' ? ' active' : null)} />
              <span className={combineClassNames('dot', currentShow === 'lyric' ? ' active' : null)} />
            </div>
            <div className="progress-wrapper">
              <span className="time time-l">{fmtTime}</span>
              <div className="progress-bar-wrapper">
                <Progress percent={percent * 100} after={null} />
              </div>
              <span className="time time-r">{totalTime}</span>
            </div>
            <div className="operators">
              <div
                className="icon i-left"
                onClick={changeMode}
              >
                <Icon type={playMode} />
              </div>
              <div
                className={`icon i-left`}
              >
                <Icon type={'previous'} />
              </div>
              <div
                className={`icon i-center`}
                onClick={togglePlay}
              >
                <Icon type={playing ? 'pause-missing' : 'play-missing'} />
              </div>
              <div
                className={`icon i-right`}
              >
                <Icon type={'next'} />
              </div>
              <div
                className="icon i-right"
              >
              </div>
            </div>
          </div>
        </div>
      </CSSTransition>
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
            onClick={toggleFullScreen}
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
                playing ? <Icon type={'pause'} className={'pause-icon'} /> : <Icon type={'play'} className={'play-icon'} />
              }
            />
          </div>
          <div
            className="control right-control"
          >
            <Icon type={'play-list'} className={'ctrl-icon'} />
          </div>
        </div>
      </CSSTransition>
    </div>
  );
};
export const Player = forwardRef(PlayerFc);
