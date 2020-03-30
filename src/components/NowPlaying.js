import React from 'react';
import './NowPlaying.css';
import AudioPlayer from 'react-h5-audio-player';
// import 'react-h5-audio-player/lib/styles.css';

function NowPlaying() {
  return (
    <div className='nowPlaying'>
      <div className='nowPlaying__albumArt'>
        <img
          className='nowPlaying__albumArt__img'
          src='/image/default_album_art.jpg'
          alt=''
        />
      </div>
      <div className='nowPlaying__songInfo'>
        <div className='nowPlaying__songInfo__name'>Genius</div>
        <div className='nowPlaying__songInfo__artist'>LSD</div>
        <div className='nowPlaying__songInfo__album'>LABRINTH, SIA & DIPLO PRESENT... LSD</div>
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
          src='/audio/genius.mp3'
          showSkipControls={true}
          showJumpControls={false}
          customVolumeControls={[]}
          onPlay={e => console.log('onPlay')}
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
}

export default NowPlaying;
