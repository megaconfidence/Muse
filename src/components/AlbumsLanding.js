import React, { useEffect, useState } from 'react';
import './AlbumsLanding.css';
import LazyLoad, { forceCheck } from 'react-lazyload';
import { Link } from 'react-router-dom';
import LandingSearch from './LandingSearch';
import ObjectID from 'bson-objectid';
import SearchNotFound from './SearchNotFound';

const LazyLoadPlaceholder = () => (
  <div className='aLanding__list__album loading'>
    <div
      className='aLanding__list__album__cover'
      style={{ backgroundImage: `` }}
    ></div>
    <div className='aLanding__list__album__cover__info'>
      <div className='aLanding__list__album__cover__info__name truncate'></div>
      <div className='aLanding__list__album__cover__info__artist truncate'></div>
    </div>
  </div>
);

const AlbumsLanding = ({ path, albums }) => {
  const [searchVal, setSearchVal] = useState({ val: '' });
  const [displayedAlbums, setDisplayedAlbums] = useState({ val: [] });
  function shuffle(array) {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  // shuffle(albums);

  const getSearchVal = val => {
    const arr = [];
    setSearchVal({ val });
    if (val) {
      for (const a in albums) {
        if (albums[a].albumName.includes(val)) {
          arr.push(albums[a]);
        }
      }

      setDisplayedAlbums({ val: arr });
    } else {
      setDisplayedAlbums({ val: albums });
    }
  };

  useEffect(() => {
    setDisplayedAlbums({ val: albums });
    forceCheck()
  }, [albums]);

  return (
    <div className='aLanding'>
      <LandingSearch path={path} getSearchVal={getSearchVal} />
      <div className='aLanding__list'>
        {displayedAlbums.val.length ? (
          displayedAlbums.val.map((a, k) => (
            <LazyLoad key={k} placeholder={<LazyLoadPlaceholder />}>
              <Link
                to={{
                  pathname: `/view/album/${a.albumName}/${ObjectID()}`
                }}
              >
                <div key={k} className='aLanding__list__album'>
                  <div
                    className='aLanding__list__album__cover'
                    style={{ backgroundImage: `url(${a.albumArt})` }}
                  ></div>
                  <div className='aLanding__list__album__cover__info'>
                    <div className='aLanding__list__album__cover__info__name truncate'>
                      {a.albumName}
                    </div>
                    <div className='aLanding__list__album__cover__info__artist truncate'>
                      {a.albumArtist}
                    </div>
                  </div>
                </div>
              </Link>
            </LazyLoad>
          ))
        ) : searchVal.val.length ? (
          <SearchNotFound />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default AlbumsLanding;
