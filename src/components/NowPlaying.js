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
import config from 'environment';
import useError from './hooks/useError';
import apolloClient from '../apolloClient';
import gql from 'graphql-tag';

// import 'react-h5-audio-player/lib/styles.css';

const NowPlaying = forwardRef(
  (
    {
      data,
      songs,
      path,
      showSongModal,
      setPlayingData,
      queuePlayBtnRef,
      showSongInfoModal,
      playingSongQueues,
      syncLikes
    },
    ref
  ) => {
    const { playerRef, playerCompRef } = ref;
    const playingId = useRef(null);
    const tempPlaying = useRef(null);
    const { enqueueSnackbar } = useSnackbar();
    const playLoderRef = useRef(null);
    const [playing, setPlaying] = useState({ val: {} });
    const [likeBtn, setLikeBtn] = useState({ val: false });
    const [ErrModal, showErrModal] = useError(
      'An error occured while trying to play this song',
      reloadSong
    );

    const handlePlayError = ({ target }) => {
      playLoderRef.current.classList.remove('hide');
      showErrModal(true);
    };

    function reloadSong() {
      showErrModal(true);
      tempPlaying.current = playing.val;
      setPlaying({ val: {} });
      setPlayingData({}, path);

      setTimeout(() => {
        setPlaying({ val: tempPlaying.current });
        setPlayingData(tempPlaying.current, path);
      }, 1000);
    }

    const getPlayingIndex = useCallback(() => {
      const indexFinder = (s) => {
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
          setPlayingData(playingSongQueues[pIndex - 1], path);

          playingId.current = playingSongQueues[pIndex - 1].queueId;
        } else {
          enqueueSnackbar('Reached top of playlist', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center'
            }
          });
          setPlaying({ val: playingSongQueues[playingSongQueues.length - 1] });
          setPlayingData(playingSongQueues[playingSongQueues.length - 1], path);
          playingId.current =
            playingSongQueues[playingSongQueues.length - 1].queueId;
        }
      }
    }, [
      enqueueSnackbar,
      getPlayingIndex,
      path,
      playingSongQueues,
      setPlayingData
    ]);

    const handleClickNext = useCallback(() => {
      console.log('click next');
      if (playingSongQueues.length) {
        const pIndex = getPlayingIndex();
        if (pIndex < playingSongQueues.length - 1) {
          setPlaying({ val: playingSongQueues[pIndex + 1] });
          setPlayingData(playingSongQueues[pIndex + 1], path);

          playingId.current = playingSongQueues[pIndex + 1].queueId;
        } else {
          enqueueSnackbar('Reached end of playlist', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center'
            }
          });
          setPlaying({ val: playingSongQueues[0] });
          setPlayingData(playingSongQueues[0], path);
          playingId.current = playingSongQueues[0].queueId;
        }
      }
    }, [
      enqueueSnackbar,
      getPlayingIndex,
      path,
      playingSongQueues,
      setPlayingData
    ]);

    const setMediaMetaData = useCallback((data) => {
      if ('mediaSession' in navigator) {
        // eslint-disable-next-line no-undef
        navigator.mediaSession.metadata = new MediaMetadata({
          title: data.name
            ? data.name
                .split(' ')
                .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ')
            : '',
          artist: data.artist
            ? data.artist
                .split(' ')
                .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ')
            : '',
          album: data.album
            ? data.album
                .split(' ')
                .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
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
              setPlayingData(playingSongQueues[pIndex - 1], path);

              playingId.current = playingSongQueues[pIndex - 1].queueId;
            } else {
              setMediaMetaData(playingSongQueues[playingSongQueues.length - 1]);
              setPlaying({
                val: playingSongQueues[playingSongQueues.length - 1]
              });
              setPlayingData(
                playingSongQueues[playingSongQueues.length - 1],
                path
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
              setPlayingData(playingSongQueues[pIndex + 1], path);
              playingId.current = playingSongQueues[pIndex + 1].queueId;
            } else {
              setMediaMetaData(playingSongQueues[0]);
              setPlaying({ val: playingSongQueues[0] });
              setPlayingData(playingSongQueues[0], path);

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
    }, [playerRef, playingSongQueues, setMediaMetaData, setPlayingData, path]);

    const getSong = useCallback(async (data, path = 'lorem') => {
      console.log(path);
      /**
       * Check if data is a valid object
       */
      if (Object.keys(data).length) {
        console.log(data);
        // setMediaMetaData(data);
        // setPlaying({ val: data });
        // setPlayingData(data, path);

        // playingId.current = playingSongQueues.length
        //   ? playingSongQueues.length
        //   : 0;
      } else {
        const { data } = await apolloClient.query({
          query: gql`
          query {
            song(_id: "${path}") {
              _id
              name
              duration
              artist {
                name
              }
              album {
                url
                cover
                name
              }
            }
           }
      `
        });

        if (data) {
          console.log(data);
        }

        // const path = path
        //   .replace(/(\?artist=)/g, '')
        //   .replace(/%20/g, ' ')
        //   .split('&song=');
        // const artist = path[0];
        // const track = path[1];

        // for (const a in songs) {
        //   if (a === artist) {
        //     for (const s in songs[a]) {
        //       for (const i in songs[a][s].albumSongs) {
        //         if (songs[a][s].albumSongs[i].name === track) {
        //           const obj = {
        //             cover: songs[a][s].albumArt,
        //             album: songs[a][s].albumName,
        //             artist: songs[a][s].albumArtist,
        //             url: songs[a][s].albumSongs[i].url,
        //             name: songs[a][s].albumSongs[i].name
        //           };

        //           const indexFinder = (s) => {
        //             if (
        //               s.name === obj.name &&
        //               s.artist === obj.artist &&
        //               s.album === obj.album
        //             ) {
        //               //Do nothing it the match is exact
        //               return s;
        //             }
        //           };
        //           if (playingSongQueues.length) {
        //             const pIndex = playingSongQueues.findIndex(indexFinder);
        //             playingId.current = pIndex;
        //           } else {
        //             playingId.current = 0;
        //           }
        //           setMediaMetaData(obj);
        //           setPlaying({ val: obj });
        //           setPlayingData(obj, path);
        //         }
        //       }
        //     }
        //   }
        // }
      }
    }, []);

    const handleLikeClick = ({ target }) => {
      const state = target.getAttribute('data-imgname');
      if (state === 'like') {
        target.setAttribute('data-imgname', 'like_fill');
        let likes = localStorage.getItem(`${config.appName}_LIKES`);
        if (likes && likes !== 'undefined') {
          likes = JSON.parse(likes);
          let isSongInList = false;
          for (const s in likes) {
            if (
              playing.val.name === likes[s].name &&
              playing.val.album === likes[s].album &&
              playing.val.artist === likes[s].artist
            ) {
              isSongInList = true;
              // Song is already in likes
            }
          }
          if (!isSongInList) {
            const data = playing.val;
            delete data.cat;
            delete data.catId;
            delete data.queueId;
            likes.push(data);
            localStorage.setItem(
              `${config.appName}_LIKES`,
              JSON.stringify(likes)
            );
          }
        } else {
          localStorage.setItem(
            `${config.appName}_LIKES`,
            JSON.stringify([playing.val])
          );
        }
      } else {
        target.setAttribute('data-imgname', 'like');
        let likes = localStorage.getItem(`${config.appName}_LIKES`);
        if (likes && likes !== 'undefined') {
          likes = JSON.parse(likes);
          const arr = [];
          for (const s in likes) {
            if (
              likes[s].name === data.name &&
              likes[s].artist === data.artist &&
              likes[s].album === data.album
            ) {
              // Do nothing if found in likes
            } else {
              arr.push(likes[s]);
            }
          }
          localStorage.setItem(`${config.appName}_LIKES`, JSON.stringify(arr));
        }
      }

      syncLikes();
    };

    // useEffect(() => {
    //   let likes = localStorage.getItem(`${config.appName}_LIKES`);
    //   if (likes && likes !== 'undefined') {
    //     likes = JSON.parse(likes);
    //     let isFound = false;
    //     for (const s in likes) {
    //       if (
    //         likes[s].name === playing.val.name &&
    //         likes[s].artist === playing.val.artist &&
    //         likes[s].album === playing.val.album
    //       ) {
    //         isFound = true;
    //       }
    //     }
    //     if (isFound) {
    //       setLikeBtn({ val: true });
    //     } else {
    //       setLikeBtn({ val: false });
    //     }
    //   }
    // }, [playing.val.album, playing.val.artist, playing.val.name]);

    useEffect(() => {
      getSong(data, path);
    }, [data, getSong, path]);

    // useEffect(() => {

    //   playerRef.current.audio.current.addEventListener('waiting', () => {
    //     console.log('waiting');
    //     playLoderRef.current.classList.remove('hide');
    //   });
    //   playerRef.current.audio.current.addEventListener('loadeddata', () => {
    //     console.log('loadeddata');
    //     playLoderRef.current.classList.add('hide');
    //   });
    //   playerRef.current.audio.current.addEventListener('canplay', () => {
    //     console.log('canplay');
    //     playLoderRef.current.classList.add('hide');
    //   });

    // }, [playerRef]);

    // useEffect(() => {
    //   setMediaControls();
    // });

    return (
      <div
        className='nowPlaying hide'
        ref={playerCompRef}
        style={{
          height: `calc(${document.documentElement.clientHeight}px - 84px)`
        }}
      >
        <ErrModal />
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
              <div
                data-img
                data-imgname={likeBtn.val ? 'like_fill' : 'like'}
                onClick={handleLikeClick}
              />
              {/* <div data-img data-imgname='like_fill' /> */}
              <div
                data-img
                data-imgname='info'
                onClick={() => {
                  showSongInfoModal(playing.val);
                }}
              />
              <div
                data-img
                data-imgname='menu_horizontal'
                onClick={() => {
                  showSongModal({ cat: 'nowplaying', ...playing.val });
                }}
              />
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
            onAbort={() => {
              console.log('abort');
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
