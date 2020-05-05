import './index.css';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
import apolloClient from './apolloClient';
import { SnackbarProvider } from 'notistack';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from '@apollo/react-hooks';

const imgSrc = [
  '/image/muse.webp',
  '/image/icon/add_playlist.svg',
  '/image/icon/album.svg',
  '/image/icon/alert.svg',
  '/image/icon/all_songs.svg',
  '/image/icon/arrow_left.svg',
  '/image/icon/artist.svg',
  '/image/icon/cancel.svg',
  '/image/icon/car.svg',
  '/image/icon/caret_down.svg',
  '/image/icon/clock.svg',
  '/image/icon/close.svg',
  '/image/icon/edit.svg',
  '/image/icon/fire.svg',
  '/image/icon/folder.svg',
  '/image/icon/getSvg.js',
  '/image/icon/info.svg',
  '/image/icon/laptop.svg',
  '/image/icon/like.svg',
  '/image/icon/like_fill.svg',
  '/image/icon/list.svg',
  '/image/icon/loading.svg',
  '/image/icon/loading_2.svg',
  '/image/icon/menu.svg',
  '/image/icon/menu_fill.svg',
  '/image/icon/mobile.svg',
  '/image/icon/mute.svg',
  '/image/icon/next.svg',
  '/image/icon/no_repeat.svg',
  '/image/icon/pause.svg',
  '/image/icon/play.svg',
  '/image/icon/play_circle.svg',
  '/image/icon/play_circle4.svg',
  '/image/icon/playlist.svg',
  '/image/icon/plus.svg',
  '/image/icon/queue.svg',
  '/image/icon/remove.svg',
  '/image/icon/repeat.svg',
  '/image/icon/save.svg',
  '/image/icon/search.svg',
  '/image/icon/settings.svg',
  '/image/icon/share.svg',
  '/image/icon/sort.svg',
  '/image/icon/speakers.svg',
  '/image/icon/tag.svg',
  '/image/icon/tv.svg',
  '/image/icon/voice.svg',
  '/image/icon/volume.svg',
  '/image/icon/watch.svg'
];

ReactDOM.render(
  <>
    {imgSrc.map((d, i) => (
      <img src={d} key={i} alt='' />
    ))}
  </>,
  document.getElementById('imgcache')
);

ReactDOM.render(
  <SnackbarProvider>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </SnackbarProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
