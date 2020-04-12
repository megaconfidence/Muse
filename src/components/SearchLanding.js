import LandingSearch from './LandingSearch';
import './SearchLanding.css';
import SongItem from './SongItem';
import React, { useState, useRef } from 'react';
import LazyLoad from 'react-lazyload';
import { Link } from 'react-router-dom';

import SongModal from './SongModal';

function SearchLanding({ songs, handleSetSongQueues }) {
  // console.log(songs)
  const [songMatch, setSongMatch] = useState({ val: [] });
  const [albumMatch, setAlbumMatch] = useState({ val: [] });
  const [artistMatch, setArtistMatch] = useState({ val: [] });
  const [songModalData, setSongModalData] = useState({ val: {} });

  const songPane = useRef(null);
  const albumPane = useRef(null);
  const artistPane = useRef(null);

  const songModalRef = useRef(null);
  const handleSetSongModalData = data => {
    setSongModalData({ val: data });
  };

  const getSearchVal = val => {
    const songMatchArr = [];
    const albumMatchArr = [];
    const artistMatchArr = [];

    if (val) {
      for (const ar in songs) {
        if (ar.includes(val)) {
          artistMatchArr.push(ar);
        }

        for (const a in songs[ar]) {
          if (songs[ar][a].albumName.includes(val)) {
            albumMatchArr.push(songs[ar][a].albumName);
          }
          for (const s in songs[ar][a].albumSongs) {
            if (songs[ar][a].albumSongs[s].name.includes(val)) {
              const obj = {
                cover: songs[ar][a].albumArt,
                album: songs[ar][a].albumName,
                artist: songs[ar][a].albumArtist,
                url: songs[ar][a].albumSongs[s].url,
                name: songs[ar][a].albumSongs[s].name
              };
              songMatchArr.push(obj);
            }
          }
        }
      }
    }

    setSongMatch({ val: songMatchArr });
    setAlbumMatch({ val: albumMatchArr });
    setArtistMatch({ val: artistMatchArr });
  };
  const showCategory = ({ target }) => {
    document.querySelectorAll('.shLanding__tab__item').forEach(tab => {
      if (tab.id !== target.id) {
        tab.classList.remove('shLanding__tab__item--active');
      } else {
        tab.classList.add('shLanding__tab__item--active');
      }
      if (target.id === 'songs') {
        songPane.current.classList.remove('hide');
        albumPane.current.classList.add('hide');
        artistPane.current.classList.add('hide');
      }
      if (target.id === 'albums') {
        songPane.current.classList.add('hide');
        albumPane.current.classList.remove('hide');
        artistPane.current.classList.add('hide');
      }
      if (target.id === 'artists') {
        songPane.current.classList.add('hide');
        albumPane.current.classList.add('hide');
        artistPane.current.classList.remove('hide');
      }
    });
  };
  return (
    <div className='shLanding'>
      <LandingSearch getSearchVal={getSearchVal} />
      <div className='shLanding__tab'>
        <div
          id='songs'
          className='shLanding__tab__item shLanding__tab__item--active'
          onClick={showCategory}
        >
          Songs
        </div>{' '}
        <div
          id='albums'
          className='shLanding__tab__item '
          onClick={showCategory}
        >
          Albums
        </div>{' '}
        <div
          id='artists'
          className='shLanding__tab__item'
          onClick={showCategory}
        >
          Artists
        </div>
      </div>

      <div className='shLanding__songPane' ref={songPane}>
        <SongModal
          cat='search'
          ref={songModalRef}
          songModalData={songModalData.val}
          handleSetSongQueues={handleSetSongQueues}
        />
        <div className='shLanding__songs__list'>
          {songMatch.val.map((s, k) => (
            <LazyLoad key={k} placeholder={<div>***</div>}>
              <SongItem
                //   cat={cat}
                url={s.url}
                name={s.name}
                album={s.album}
                cover={s.cover}
                artist={s.artist}
                queueId={s.queueId}
                ref={songModalRef}
                handleSetSongQueues={handleSetSongQueues}
                handleSetSongModalData={handleSetSongModalData}
              />
            </LazyLoad>
          ))}
        </div>
      </div>
      <div className='shLanding__albumPane hide' ref={albumPane}>
        {albumMatch.val.map((a, k) => (
          <Link
            key={k}
            to={{
              pathname: `/view/album/${a}`
            }}
          >
            <div className='shLanding__pane__item truncate'>{a}</div>
          </Link>
        ))}
      </div>
      <div className='shLanding__artistPane hide' ref={artistPane}>
        {artistMatch.val.map((a, k) => (
          <Link
            key={k}
            to={{
              pathname: `/view/artist/${a}`
            }}
          >
            <div className='shLanding__pane__item truncate'>{a}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SearchLanding;
