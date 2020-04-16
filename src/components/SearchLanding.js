import LandingSearch from './LandingSearch';
import './SearchLanding.css';
import SongItem from './SongItem';
import React, { useState, useRef } from 'react';
import LazyLoad, { forceCheck } from 'react-lazyload';
import { Link } from 'react-router-dom';
import ObjectID from 'bson-objectid';
import SearchNotFound from './SearchNotFound';
import { useEffect } from 'react';
import { useCallback } from 'react';

function SearchLanding({
  filterList,
  handleSearch,
  showSongModal,
  songMatchDisplay,
  albumMatchDisplay,
  artistMatchDisplay,
  handleSetSongQueues
}) {
  const [path, setPath] = useState({ val: 'Songs' });
  const [searchVal, setSearchVal] = useState({ val: '' });
  const [dontShowSearchNotFound, setDontShowSearchNotFound] = useState({
    val: true
  });

  const songPane = useRef(null);
  const albumPane = useRef(null);
  const artistPane = useRef(null);



  const setSearch = useCallback(
    (query, cat) => {
      setSearchVal({ val: query });
      handleSearch(query, 'search');
    },
    [handleSearch]
  );

  useEffect(() => {
    forceCheck();
  }, [path]);

  useEffect(() => {
    setTimeout(() => {
      forceCheck();
    }, 500)
  }, []);

  useEffect(() => {
    if (!songMatchDisplay.length && path.val === 'Songs') {
      setDontShowSearchNotFound({ val: false });
    } else if (!albumMatchDisplay.length && path.val === 'Albums') {
      setDontShowSearchNotFound({ val: false });
    } else if (!artistMatchDisplay.length && path.val === 'Artists') {
      setDontShowSearchNotFound({ val: false });
    } else {
      setDontShowSearchNotFound({ val: true });
    }
  }, [
    albumMatchDisplay.length,
    artistMatchDisplay.length,
    path.val,
    songMatchDisplay.length
  ]);
  const showCategory = ({ target }) => {
    document.querySelectorAll('.shLanding__tab__item').forEach(tab => {
      if (tab.id !== target.id) {
        tab.classList.remove('shLanding__tab__item--active');
      } else {
        tab.classList.add('shLanding__tab__item--active');
      }
      if (target.id === 'songs') {
        setPath({ val: 'Songs' });
        songPane.current.classList.remove('hide');
        albumPane.current.classList.add('hide');
        artistPane.current.classList.add('hide');
      }
      if (target.id === 'albums') {
        setPath({ val: 'Albums' });
        songPane.current.classList.add('hide');
        albumPane.current.classList.remove('hide');
        artistPane.current.classList.add('hide');
      }
      if (target.id === 'artists') {
        setPath({ val: 'Artists' });
        songPane.current.classList.add('hide');
        albumPane.current.classList.add('hide');
        artistPane.current.classList.remove('hide');
      }
    });
  };

  const interCeptFilterList = useCallback(
    val => {
      filterList('search ' + val.toLowerCase());
    },
    [filterList]
  );
  return (
    <div className='shLanding'>
      <LandingSearch
        getSearchVal={setSearch}
        filterList={interCeptFilterList}
        path={path.val}
      />
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
        <div className='shLanding__songs__list'>
          {dontShowSearchNotFound.val ? (
            songMatchDisplay.map((s, k) => (
              <LazyLoad key={k} placeholder={<div>***</div>}>
                <SongItem
                  url={s.url}
                  name={s.name}
                  cat={'search'}
                  album={s.album}
                  cover={s.cover}
                  artist={s.artist}
                  queueId={s.queueId}
                  showSongModal={showSongModal}
                  handleSetSongQueues={handleSetSongQueues}
                />
              </LazyLoad>
            ))
          ) : searchVal.val.length ? (
            <SearchNotFound />
          ) : (
            <SearchNotFound text={`Search for ${path.val}`} />
          )}
        </div>
      </div>
      <div className='shLanding__albumPane hide' ref={albumPane}>
        {dontShowSearchNotFound.val ? (
          albumMatchDisplay.map((a, k) => (
            <Link
              key={k}
              to={{
                pathname: `/view/album/${a}/${ObjectID()}`
              }}
            >
              <div className='shLanding__pane__item truncate'>{a}</div>
            </Link>
          ))
        ) : searchVal.val.length ? (
          <SearchNotFound />
        ) : (
          <SearchNotFound text={`Search for ${path.val}`} />
        )}
      </div>
      <div className='shLanding__artistPane hide' ref={artistPane}>
        {dontShowSearchNotFound.val ? (
          artistMatchDisplay.map((a, k) => (
            <Link
              key={k}
              to={{
                pathname: `/view/artist/${a}/${ObjectID()}`
              }}
            >
              <div className='shLanding__pane__item truncate'>{a}</div>
            </Link>
          ))
        ) : searchVal.val.length ? (
          <SearchNotFound />
        ) : (
          <SearchNotFound text={`Search for ${path.val}`} />
        )}
      </div>
    </div>
  );
}

export default SearchLanding;
