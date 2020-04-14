import React from 'react';
import './AlbumsLanding.css';
import LazyLoad from 'react-lazyload';
import { Link } from 'react-router-dom';
import LandingSearch from './LandingSearch';
import ObjectID from 'bson-objectid'

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

function AlbumsLanding({path, albums }) {
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

  albums = albums.flat();
  // shuffle(albums);

  return (
    <div className='aLanding'>
      <LandingSearch path={path}/>
      <div className='aLanding__list'>
        {albums.map((a, k) => (
          <LazyLoad key={k} placeholder={<LazyLoadPlaceholder />}>
            <Link
              to={{
                pathname: `/view/album/${a.albumName}/${ObjectID()}`,
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
        ))}
      </div>
    </div>
  );
}

export default AlbumsLanding;
