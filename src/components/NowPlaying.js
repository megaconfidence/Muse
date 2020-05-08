import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useCallback,
} from 'react';
import './NowPlaying.css';
import axios from 'axios';
import gql from 'graphql-tag';
import config from 'environment';
import request from '../helpers';
import useError from './hooks/useError';
import { useSnackbar } from 'notistack';
import { useContext } from 'react';
import apolloClient from '../apolloClient';
import AppContext from './hooks/AppContext';
import useInfoModal from './hooks/useInfoModal';
import AudioPlayer from 'react-h5-audio-player';
import useSongModal from './hooks/useSongModal';
// import 'react-h5-audio-player/lib/styles.css';

const NowPlaying = forwardRef(({ path, queuePlayBtnRef }, ref) => {
  const { playerRef, playerCompRef } = ref;
  const playingId = useRef(null);
  const tempPlaying = useRef(null);
  const playLoderRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const [likeBtn, setLikeBtn] = useState(false);
  const [SongModal, showSongModal] = useSongModal();
  const [playUrl, setPlayUrl] = useState(undefined);
  const [appData, setAppData] = useContext(AppContext);
  const [playing, setPlaying] = useState({ album: {}, artist: {} });
  const [setInfoModalData, shwoInfoModal, InfoModal] = useInfoModal();

  const [ErrModal, showErrModal] = useError(
    'An error occured while trying to play this song',
    reloadSong
  );

  const handlePlayError = ({ target }) => {
    playLoderRef.current.classList.remove('hide');
    showErrModal(true);
  };
  const setPlayingData = useCallback(
    (playing, path) => {
      if (playing) {
        setAppData({ ...appData, playing });
        localStorage.setItem(
          `${config.appName}_PLAYING`,
          JSON.stringify(playing)
        );
      }
      if (path) {
        // setPlayPath({ val: path });
        localStorage.setItem(
          `${config.appName}_PLAYPATH`,
          JSON.stringify(path)
        );
      }
    },
    [appData, setAppData]
  );

  function reloadSong() {
    showErrModal(true);
    tempPlaying.current = playing;
    setPlaying({ album: {}, artist: {} });

    setTimeout(() => {
      const pathId = path.replace('/play/', '');
      if (path.includes('/play/') && pathId) {
        getSong(appData.playing, pathId);
      }
    }, 1000);
  }

  const getPlayingIndex = useCallback(() => {
    const indexFinder = (s) => {
      if (s.queueId === playing.queueId) {
        //Do nothing it the match is exact
        return s;
      }
    };
    return appData.playingQueue.findIndex(indexFinder);
  }, [playing.queueId, appData.playingQueue]);

  const handleClickPrevious = useCallback(() => {
    if (appData.playingQueue.length) {
      const pIndex = getPlayingIndex();
      if (pIndex > 0) {
        setPlaying(appData.playingQueue[pIndex - 1]);
        setPlayingData(appData.playingQueue[pIndex - 1], path);

        playingId.current = appData.playingQueue[pIndex - 1].queueId;
      } else {
        enqueueSnackbar('Reached top of playlist', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        });
        setPlaying(appData.playingQueue[appData.playingQueue.length - 1]);
        setPlayingData(
          appData.playingQueue[appData.playingQueue.length - 1],
          path
        );
        playingId.current =
          appData.playingQueue[appData.playingQueue.length - 1].queueId;
      }
    } else if (appData.queue.length) {
      const pIndex = getPlayingIndex();
      if (pIndex > 0) {
        setPlaying(appData.queue[pIndex - 1]);
        setPlayingData(appData.queue[pIndex - 1], path);

        playingId.current = appData.queue[pIndex - 1].queueId;
      } else {
        enqueueSnackbar('Reached top of playlist', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        });
        setPlaying(appData.queue[appData.queue.length - 1]);
        setPlayingData(appData.queue[appData.queue.length - 1], path);
        playingId.current = appData.queue[appData.queue.length - 1].queueId;
      }
    }
  }, [
    appData.playingQueue,
    appData.queue,
    getPlayingIndex,
    setPlayingData,
    path,
    enqueueSnackbar,
  ]);

  const handleClickNext = useCallback(() => {
    if (appData.playingQueue.length) {
      const pIndex = getPlayingIndex();
      if (pIndex < appData.playingQueue.length - 1) {
        setPlaying(appData.playingQueue[pIndex + 1]);
        setPlayingData(appData.playingQueue[pIndex + 1], path);

        playingId.current = appData.playingQueue[pIndex + 1].queueId;
      } else {
        enqueueSnackbar('Reached end of playlist', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        });
        setPlaying(appData.playingQueue[0]);
        setPlayingData(appData.playingQueue[0], path);
        playingId.current = appData.playingQueue[0].queueId;
      }
    } else if (appData.queue.length) {
      const pIndex = getPlayingIndex();
      if (pIndex < appData.queue.length - 1) {
        setPlaying(appData.queue[pIndex + 1]);
        setPlayingData(appData.queue[pIndex + 1], path);

        playingId.current = appData.queue[pIndex + 1].queueId;
      } else {
        enqueueSnackbar('Reached end of playlist', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        });
        setPlaying(appData.queue[0]);
        setPlayingData(appData.queue[0], path);
        playingId.current = appData.queue[0].queueId;
      }
    }
  }, [
    appData.playingQueue,
    appData.queue,
    getPlayingIndex,
    setPlayingData,
    path,
    enqueueSnackbar,
  ]);

  const setMediaMetaData = useCallback((song) => {
    if ('mediaSession' in navigator) {
      // eslint-disable-next-line no-undef
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.name
          ? song.name
              .split(' ')
              .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
              .join(' ')
          : '',
        artist: song.artist.name
          ? song.artist.name
              .split(' ')
              .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
              .join(' ')
          : '',
        album: song.album.name
          ? song.album.name
              .split(' ')
              .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
              .join(' ')
          : '',
        artwork: [
          { src: song.album.cover || '', sizes: '96x96', type: 'image/png' },
          {
            src: song.album.cover || '',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: song.album.cover || '',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: song.album.cover || '',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: song.album.cover || '',
            sizes: '384x384',
            type: 'image/png',
          },
          { src: song.album.cover || '', sizes: '512x512', type: 'image/png' },
        ],
      });
    }
  }, []);

  const setMediaControls = useCallback(() => {
    if ('mediaSession' in navigator) {
      const audio = playerRef.current.audio.current;
      navigator.mediaSession.setActionHandler(
        'previoustrack',
        handleClickPrevious
      );

      navigator.mediaSession.setActionHandler('nexttrack', handleClickNext);
      navigator.mediaSession.setActionHandler('play', () => {
        audio.play();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        audio.pause();
      });
    }
  }, [playerRef, handleClickPrevious, handleClickNext]);

  const getUrl = useCallback(
    async (playId, albumUrl) => {
      const server = [
        config.api,
        'https://muse-proxy-1.herokuapp.com/',
        'https://muse-proxy-2.herokuapp.com/',
        'https://muse-proxy-3.herokuapp.com/',
      ];

      try {
        const songUrl = await axios({
          method: 'POST',
          url: server[Math.floor(Math.random() * server.length)],
          data: { playId, albumUrl },
        }).then((res) => res.data);

        setPlayUrl(songUrl.url);
        playerRef.current.audio.current.play();
      } catch (err) {
        console.log(err);
        showErrModal(true);
      }

      // try {
      //   const { data } = await apolloClient.query({
      //     query: gql`
      //       query {
      //         getSongUrl(playId: "${playId}", albumUrl: "${albumUrl}"){
      //           _id
      //           url
      //         }
      //        }
      //   `,
      //   });

      //   setPlayUrl(data.getSongUrl.url);
      //   playerRef.current.audio.current.play();
      // } catch (err1) {
      //   console.log(err1);
      //   showErrModal(true);
      // }
    },
    [playerRef, showErrModal]
  );

  const getSong = useCallback(
    async (song, path) => {
      try {
        if (Object.keys(song).length) {
          setPlaying(song);
          setMediaControls();
          setMediaMetaData(song);
          setInfoModalData(song);
          getUrl(song.playId, song.album.url);
        } else {
          const { data } = await apolloClient.query({
            query: gql`
                query {
                  song(_id: "${path}") {
                    _id
                    name
                    playId
                    duration
                    artist {
                      name
                    }
                    album {
                      url
                      cover
                      name
                      genre {
                        name
                      }
                    }
                  }
               }
          `,
          });

          const song = data.song;
          setPlaying(song);
          setMediaControls();
          setMediaMetaData(song);
          setInfoModalData(song);
          getUrl(song.playId, song.album.url);
          setAppData({ ...appData, playing: song });
        }
      } catch (err) {
        console.log(err);
        showErrModal(true);
      }
    },
    [
      appData,
      getUrl,
      setAppData,
      setInfoModalData,
      setMediaControls,
      setMediaMetaData,
      showErrModal,
    ]
  );
  const syncLikes = useCallback(async () => {
    try {
      let id = localStorage.getItem(`${config.appName}_LIKESID`);
      let likes = localStorage.getItem(`${config.appName}_LIKES`);
      if (likes && likes !== 'undefined') {
        likes = JSON.parse(likes);
        if (id && id !== 'undefined') {
          id = JSON.parse(id);
          const data = await request('put', `api/like/${id}`, {
            songs: likes,
          });
          const songs = data.data.data.songs;
          localStorage.setItem(
            `${config.appName}_LIKES`,
            JSON.stringify(songs)
          );
          setAppData({ ...appData, likes: songs });
        } else {
          const data = await request('post', 'api/like', {
            songs: likes,
          });
          const songs = data.data.data.songs;
          localStorage.setItem(
            `${config.appName}_LIKESID`,
            JSON.stringify(data.data.data._id)
          );
          localStorage.setItem(
            `${config.appName}_LIKES`,
            JSON.stringify(songs)
          );
          setAppData({ ...appData, likes: songs });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, [appData, setAppData]);
  const handleLikeClick = ({ target }) => {
    const state = target.getAttribute('data-imgname');
    if (state === 'like') {
      target.setAttribute('data-imgname', 'like_fill');
      const likes = appData.likes;
      if (likes.length) {
        let isSongInList = false;
        for (const s in likes) {
          if (playing._id === likes[s]._id) {
            isSongInList = true;
            // Song is already in likes
          }
        }
        if (!isSongInList) {
          const data = playing;
          delete data.cat;
          delete data.catId;
          delete data.queueId;
          delete data.catName;
          likes.push(data);
          localStorage.setItem(
            `${config.appName}_LIKES`,
            JSON.stringify(likes)
          );
          setAppData({ ...appData, likes });
        }
      } else {
        localStorage.setItem(
          `${config.appName}_LIKES`,
          JSON.stringify([playing])
        );
        setAppData({ ...appData, likes: [playing] });
      }
    } else {
      target.setAttribute('data-imgname', 'like');
      const arr = [];
      for (const s in appData.likes) {
        if (appData.likes[s]._id !== playing._id) {
          arr.push(appData.likes[s]);
        }
      }
      localStorage.setItem(`${config.appName}_LIKES`, JSON.stringify(arr));
      setAppData({ ...appData, likes: arr });
    }

    syncLikes();
  };

  useEffect(() => {
    let isFound = false;
    for (const s in appData.likes) {
      if (appData.likes[s]._id === playing._id) {
        isFound = true;
      }
    }
    if (isFound) {
      setLikeBtn(true);
    } else {
      setLikeBtn(false);
    }
  }, [appData.likes, playing._id]);

  useEffect(() => {
    const pathId = path.replace('/play/', '');
    if (path.includes('/play/') && pathId) {
      getSong(appData.playing, pathId);
    }
  }, [appData.playing, getSong, path]);

  const waitingEvent = useCallback(() => {
    playLoderRef.current.classList.remove('hide');
  }, []);
  const canplayEvent = useCallback(() => {
    playLoderRef.current.classList.add('hide');
  }, []);
  const loadeddataEvent = useCallback(() => {
    playLoderRef.current.classList.add('hide');
  }, []);
  const endedEvent = useCallback(() => {
    console.log('ended');
    if (!playerRef.current.audio.current.hasAttribute('loop')) {
      handleClickNext();
    }
  }, [handleClickNext, playerRef]);

  useEffect(() => {
    const player = playerRef.current.audio.current;
    player.addEventListener('waiting', waitingEvent);
    player.addEventListener('loadeddata', loadeddataEvent);
    player.addEventListener('canplay', canplayEvent);
    player.addEventListener('ended', endedEvent);
    return () => {
      player.removeEventListener('waiting', waitingEvent);
      player.removeEventListener('loadeddata', loadeddataEvent);
      player.removeEventListener('canplay', canplayEvent);
      player.removeEventListener('ended', endedEvent);
    };
  }, [canplayEvent, endedEvent, loadeddataEvent, playerRef, waitingEvent]);

  // useEffect(() => {
  //   setMediaControls();
  // });

  return (
    <div
      className='nowPlaying'
      ref={playerCompRef}
      style={{
        height: `calc(${document.documentElement.clientHeight}px - 84px)`,
      }}
    >
      <ErrModal />
      <InfoModal />
      <SongModal />
      <div className='nowPlaying__albumArt'>
        <div className='nowPlaying__albumArt__temp'>
          <div
            className='nowPlaying__albumArt__img'
            style={{ backgroundImage: `url(${playing.album.cover})` }}
          />
        </div>
      </div>
      <div className='nowPlaying__songInfo'>
        <div className='nowPlaying__songInfo__name'>{playing.name}</div>
        <div className='nowPlaying__songInfo__artist'>
          {playing.artist.length
            ? playing.artist.map((a) => a.name).join(' / ')
            : null}
        </div>
        <div className='nowPlaying__songInfo__album'>{playing.album.name}</div>
      </div>
      <div className='nowPlaying__playArea'>
        <div className='nowPlaying__playArea__item'>
          <div className='nowPlaying__playArea__item__controls'>
            <div
              data-img
              data-imgname={likeBtn ? 'like_fill' : 'like'}
              onClick={handleLikeClick}
            />
            {/* <div data-img data-imgname='like_fill' /> */}
            <div
              data-img
              data-imgname='info'
              onClick={() => {
                shwoInfoModal(true);
              }}
            />
            <div
              data-img
              data-imgname='menu_horizontal'
              onClick={() => {
                showSongModal({ cat: 'nowplaying', ...playing });
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
          src={playUrl}
          ref={playerRef}
          autoPlay={false}
          listenInterval={1000}
          showSkipControls={true}
          showJumpControls={false}
          customVolumeControls={[]}
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
            previous: <div data-img data-imgname='previous' />,
          }}
        />
      </div>
    </div>
  );
});

export default NowPlaying;
