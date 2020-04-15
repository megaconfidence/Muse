import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useCallback
} from 'react';
import './NowPlaying.css';
import { useSnackbar } from 'notistack';
import AudioPlayer from 'react-h5-audio-player';

// import 'react-h5-audio-player/lib/styles.css';

const NowPlaying = forwardRef(
  (
    {
      playPath,
      data,
      songs,
      queuePlayBtnRef,
      setPlayingData,
      playingSongQueues
    },
    ref
  ) => {
    const { playerRef, playerCompRef } = ref;
    const playingId = useRef(null);
    const tempPlaying = useRef(null);
    const errorModalRef = useRef(null);
    const { enqueueSnackbar } = useSnackbar();
    const playLoderRef = useRef(null);
    const [playing, setPlaying] = useState({ val: {} });

    const handlePlayError = ({ target }) => {
      playLoderRef.current.classList.remove('hide');
      errorModalRef.current.classList.toggle('hide');
    };

    const reloadSong = () => {
      errorModalRef.current.classList.toggle('hide');
      tempPlaying.current = playing.val;
      setPlaying({ val: {} });
      setPlayingData({}, playPath);

      setTimeout(() => {
        setPlaying({ val: tempPlaying.current });
        setPlayingData(tempPlaying.current, playPath);
      }, 1000);
    };

    const getPlayingIndex = useCallback(() => {
      const indexFinder = s => {
        if (s.queueId === playing.val.queueId) {
          //Do nothing it the match is exact
          return s;
        }
      };
      return playingSongQueues.findIndex(indexFinder);
    }, [playing.val.queueId, playingSongQueues]);

    const handleClickPrevious = useCallback(() => {
      if (playingSongQueues.length) {
        const pIndex = getPlayingIndex();
        if (pIndex > 0) {
          setPlaying({ val: playingSongQueues[pIndex - 1] });
          setPlayingData(playingSongQueues[pIndex - 1], playPath);

          playingId.current = playingSongQueues[pIndex - 1].queueId;
        } else {
          enqueueSnackbar('Reached top of playlist', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center'
            }
          });
          setPlaying({ val: playingSongQueues[playingSongQueues.length - 1] });
          setPlayingData(
            playingSongQueues[playingSongQueues.length - 1],
            playPath
          );
          playingId.current =
            playingSongQueues[playingSongQueues.length - 1].queueId;
        }
      }
    }, [
      enqueueSnackbar,
      getPlayingIndex,
      playPath,
      playingSongQueues,
      setPlayingData
    ]);

    const handleClickNext = useCallback(() => {
      if (playingSongQueues.length) {
        const pIndex = getPlayingIndex();
        if (pIndex < playingSongQueues.length - 1) {
          setPlaying({ val: playingSongQueues[pIndex + 1] });
          setPlayingData(playingSongQueues[pIndex + 1], playPath);

          playingId.current = playingSongQueues[pIndex + 1].queueId;
        } else {
          enqueueSnackbar('Reached end of playlist', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center'
            }
          });
          setPlaying({ val: playingSongQueues[0] });
          setPlayingData(playingSongQueues[0], playPath);
          playingId.current = playingSongQueues[0].queueId;
        }
      }
    }, [
      enqueueSnackbar,
      getPlayingIndex,
      playPath,
      playingSongQueues,
      setPlayingData
    ]);

    const setMediaMetaData = useCallback(data => {
      if ('mediaSession' in navigator) {
        // eslint-disable-next-line no-undef
        navigator.mediaSession.metadata = new MediaMetadata({
          title: data.name
            ? data.name
                .split(' ')
                .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ')
            : '',
          artist: data.artist
            ? data.artist
                .split(' ')
                .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ')
            : '',
          album: data.album
            ? data.album
                .split(' ')
                .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ')
            : '',
          artwork: [
            { src: data.cover || '', sizes: '96x96', type: 'image/png' },
            { src: data.cover || '', sizes: '128x128', type: 'image/png' },
            { src: data.cover || '', sizes: '192x192', type: 'image/png' },
            { src: data.cover || '', sizes: '256x256', type: 'image/png' },
            { src: data.cover || '', sizes: '384x384', type: 'image/png' },
            { src: data.cover || '', sizes: '512x512', type: 'image/png' }
          ]
        });
      }
    }, []);

    const setMediaControls = useCallback(() => {
      if ('mediaSession' in navigator) {
        const audio = playerRef.current.audio.current;
        navigator.mediaSession.setActionHandler('previoustrack', () => {
          if (playingSongQueues.length) {
            const pIndex = playingId.current;
            if (pIndex > 0) {
              setMediaMetaData(playingSongQueues[pIndex - 1]);
              setPlaying({ val: playingSongQueues[pIndex - 1] });
              setPlayingData(playingSongQueues[pIndex - 1], playPath);

              playingId.current = playingSongQueues[pIndex - 1].queueId;
            } else {
              setMediaMetaData(playingSongQueues[playingSongQueues.length - 1]);
              setPlaying({
                val: playingSongQueues[playingSongQueues.length - 1]
              });
              setPlayingData(
                playingSongQueues[playingSongQueues.length - 1],
                playPath
              );

              playingId.current =
                playingSongQueues[playingSongQueues.length - 1].queueId;
            }
          }
        });

        navigator.mediaSession.setActionHandler('nexttrack', () => {
          if (playingSongQueues.length) {
            const pIndex = playingId.current;
            if (pIndex < playingSongQueues.length - 1) {
              setMediaMetaData(playingSongQueues[pIndex + 1]);
              setPlaying({ val: playingSongQueues[pIndex + 1] });
              setPlayingData(playingSongQueues[pIndex + 1], playPath);
              playingId.current = playingSongQueues[pIndex + 1].queueId;
            } else {
              setMediaMetaData(playingSongQueues[0]);
              setPlaying({ val: playingSongQueues[0] });
              setPlayingData(playingSongQueues[0], playPath);

              playingId.current = playingSongQueues[0].queueId;
            }
          }
        });
        navigator.mediaSession.setActionHandler('play', () => {
          audio.play();
        });
        navigator.mediaSession.setActionHandler('pause', () => {
          audio.pause();
        });

        let skipTime = 10; // Time to skip in seconds

        navigator.mediaSession.setActionHandler('seekbackward', () => {
          audio.currentTime = Math.max(audio.currentTime - skipTime, 0);
        });

        navigator.mediaSession.setActionHandler('seekforward', () => {
          audio.currentTime = Math.min(
            audio.currentTime + skipTime,
            audio.duration
          );
        });
      }
    }, [
      playerRef,
      playingSongQueues,
      setMediaMetaData,
      setPlayingData,
      playPath
    ]);

    const getSong = useCallback(
      (data, playPath, songs) => {
        /**
         * Check if data is a valid object
         */
        if (Object.keys(data).length) {
          setMediaMetaData(data);
          setPlaying({ val: data });
          setPlayingData(data, playPath);

          playingId.current = playingSongQueues.length
            ? playingSongQueues.length
            : 0;
        } else {
          const path = playPath
            .replace(/(\?artist=)/g, '')
            .replace(/%20/g, ' ')
            .split('&song=');
          const artist = path[0];
          const track = path[1];
          for (const a in songs) {
            if (a === artist) {
              for (const s in songs[a]) {
                for (const i in songs[a][s].albumSongs) {
                  if (songs[a][s].albumSongs[i].name === track) {
                    const obj = {
                      cover: songs[a][s].albumArt,
                      album: songs[a][s].albumName,
                      artist: songs[a][s].albumArtist,
                      url: songs[a][s].albumSongs[i].url,
                      name: songs[a][s].albumSongs[i].name
                    };

                    const indexFinder = s => {
                      if (
                        s.name === obj.name &&
                        s.artist === obj.artist &&
                        s.album === obj.album
                      ) {
                        //Do nothing it the match is exact
                        return s;
                      }
                    };
                    if (playingSongQueues.length) {
                      const pIndex = playingSongQueues.findIndex(indexFinder);
                      playingId.current = pIndex;
                    } else {
                      playingId.current = 0;
                    }
                    setMediaMetaData(obj);
                    setPlaying({ val: obj });
                    setPlayingData(obj, playPath);
                  }
                }
              }
            }
          }
        }
      },
      [setMediaMetaData, setPlayingData, playingSongQueues]
    );

    useEffect(() => {
      getSong(data, playPath, songs);
    }, [data, getSong, playPath, songs]);

    useEffect(() => {
      setMediaControls();
    });

    return (
      <div className='nowPlaying hide' ref={playerCompRef}>
        <div className='error hide' ref={errorModalRef}>
          <div
            className='error__wrapper '
            onClick={() => {
              errorModalRef.current.classList.toggle('hide');
            }}
          ></div>

          <div className='error__card'>
            <div className='error__card__main'>
              <div className='error__card__main__icon'>
                <div data-img data-imgname='alert' />
              </div>
              <div className='error__card__main__text'>
                An error occured while trying to play this song
              </div>
            </div>
            <div className='error__card__footer'>
              <div className='error__card__footer__buttons'>
                <div
                  className='error__card__footer__buttons__left'
                  onClick={() => {
                    errorModalRef.current.classList.toggle('hide');
                  }}
                >
                  back
                </div>
                <div
                  className='error__card__footer__buttons__right'
                  onClick={reloadSong}
                >
                  try again
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='nowPlaying__albumArt'>
          <div className='nowPlaying__albumArt__temp'>
            <div
              className='nowPlaying__albumArt__img'
              style={{ backgroundImage: `url(${playing.val.cover})` }}
            />
          </div>
        </div>
        <div className='nowPlaying__songInfo'>
          <div className='nowPlaying__songInfo__name'>{playing.val.name}</div>
          <div className='nowPlaying__songInfo__artist'>
            {playing.val.artist}
          </div>
          <div className='nowPlaying__songInfo__album'>{playing.val.album}</div>
        </div>
        <div className='nowPlaying__playArea'>
          <div className='nowPlaying__playArea__item'>
            <div className='nowPlaying__playArea__item__controls'>
              <div data-img data-imgname='like' />
              {/* <div data-img data-imgname='like_fill' /> */}
              <div data-img data-imgname='info' />
              <div data-img data-imgname='menu_horizontal' />
            </div>
            <div className='nowPlaying__playArea__item__offset'> </div>
          </div>
          <div
            data-img
            data-imgname='loading'
            className='nowPlaying__playArea__loader hide'
            ref={playLoderRef}
          />
          <AudioPlayer
            autoPlay
            ref={playerRef}
            src={playing.val.url}
            listenInterval={1000}
            showSkipControls={true}
            showJumpControls={false}
            customVolumeControls={[]}
            onListen={() => {
              playLoderRef.current.classList.add('hide');
            }}
            onAbort={() => {
              playLoderRef.current.classList.remove('hide');
            }}
            onPlay={() => {
              if (queuePlayBtnRef.current) {
                queuePlayBtnRef.current.setAttribute('data-imgname', 'pause');
              }
            }}
            onPause={() => {
              if (queuePlayBtnRef.current) {
                queuePlayBtnRef.current.setAttribute('data-imgname', 'play');
              }
            }}
            onError={handlePlayError}
            onPlayError={handlePlayError}
            onClickNext={handleClickNext}
            onClickPrevious={handleClickPrevious}
            customIcons={{
              play: <div data-img data-imgname='play' />,
              next: <div data-img data-imgname='next' />,
              loop: <div data-img data-imgname='repeat' />,
              pause: <div data-img data-imgname='pause' />,
              volume: <div data-img data-imgname='volume' />,
              volumeMute: <div data-img data-imgname='mute' />,
              loopOff: <div data-img data-imgname='no_repeat' />,
              previous: <div data-img data-imgname='previous' />
            }}
          />
        </div>
      </div>
    );
  }
);

export default NowPlaying;
