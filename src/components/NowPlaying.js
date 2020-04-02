import React, {
  useCallback,
  useEffect,
  useState,
  forwardRef,
  useRef
} from 'react';
import './NowPlaying.css';
import AudioPlayer from 'react-h5-audio-player';
// import 'react-h5-audio-player/lib/styles.css';

const NowPlaying = forwardRef(({ playPath, data, songs }, ref) => {
  const [playing, setPlaying] = useState({ val: {} });
  const playerEleRef = useRef(null);

  const setMediaMetaData = data => {
    const audio = playerEleRef.current.audio.current;
    if ('mediaSession' in navigator) {
      // eslint-disable-next-line no-undef
      navigator.mediaSession.metadata = new MediaMetadata({
        title: data.name
          .split(' ')
          .map(s => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' '),
        artist: data.artist
          .split(' ')
          .map(s => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' '),
        album: data.album
          .split(' ')
          .map(s => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' '),
        artwork: [
          { src: data.cover, sizes: '96x96', type: 'image/png' },
          { src: data.cover, sizes: '128x128', type: 'image/png' },
          { src: data.cover, sizes: '192x192', type: 'image/png' },
          { src: data.cover, sizes: '256x256', type: 'image/png' },
          { src: data.cover, sizes: '384x384', type: 'image/png' },
          { src: data.cover, sizes: '512x512', type: 'image/png' }
        ]
      });

      navigator.mediaSession.setActionHandler('previoustrack', function() {});
      navigator.mediaSession.setActionHandler('nexttrack', function() {});
      navigator.mediaSession.setActionHandler('play', function() {
        audio.play();
      });
      navigator.mediaSession.setActionHandler('pause', function() {
        audio.pause();
      });

      let skipTime = 10; // Time to skip in seconds

      navigator.mediaSession.setActionHandler('seekbackward', function() {
        audio.currentTime = Math.max(audio.currentTime - skipTime, 0);
      });

      navigator.mediaSession.setActionHandler('seekforward', function() {
        audio.currentTime = Math.min(
          audio.currentTime + skipTime,
          audio.duration
        );
      });
    }
  };
  const getSong = useCallback((data, playPath, songs) => {
    /**
     * Check if data is a valid object
     */
    if (Object.keys(data).length) {
      setPlaying({ val: data });
      setMediaMetaData(data);
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
                setPlaying({ val: obj });
                setMediaMetaData(obj);
              }
            }
          }
        }
      }
    }
  }, []);
  const handlePlayError = ({ target }) => {
    // console.log(target.error.code);
    errorModalRef.current.classList.toggle('hide');
  };
  const temp = useRef(null);
  const errorModalRef = useRef(null);
  const reloadSong = () => {
    errorModalRef.current.classList.toggle('hide');
    temp.current = playing.val;
    setPlaying({ val: {} });
    setTimeout(() => {
      setPlaying({ val: temp.current });
    }, 1000);
  };
  useEffect(() => {
    getSong(data, playPath, songs);
  }, [data, getSong, playPath, songs]);
  return (
    <div className='nowPlaying hide' ref={ref}>
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
        <img
          className='nowPlaying__albumArt__img'
          src={playing.val.cover}
          alt=''
        />
      </div>
      <div className='nowPlaying__songInfo'>
        <div className='nowPlaying__songInfo__name'>{playing.val.name}</div>
        <div className='nowPlaying__songInfo__artist'>{playing.val.artist}</div>
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
        <AudioPlayer
          autoPlay
          src={playing.val.url}
          showSkipControls={true}
          showJumpControls={false}
          customVolumeControls={[]}
          ref={playerEleRef}
          onPlay={e => console.log('onPlay')}
          onPlayError={handlePlayError}
          onError={handlePlayError}
          customIcons={{
            play: <div data-img data-imgname='play' />,
            pause: <div data-img data-imgname='pause' />,
            previous: <div data-img data-imgname='previous' />,
            next: <div data-img data-imgname='next' />,
            loop: <div data-img data-imgname='repeat' />,
            loopOff: <div data-img data-imgname='no_repeat' />,
            volume: <div data-img data-imgname='volume' />,
            volumeMute: <div data-img data-imgname='mute' />
          }}
        />
      </div>
    </div>
  );
});

export default NowPlaying;
