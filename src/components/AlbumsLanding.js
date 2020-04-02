import React from 'react';
import './AlbumsLanding.css';
import LazyLoad from 'react-lazyload';
import { Link } from 'react-router-dom';
import LandingSearch from './LandingSearch';
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
function AlbumsLanding({ albums }) {
  function shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  albums = albums.flat();
  shuffle(albums);



  //   console.log(albums);

  return (
    <div className='aLanding'>
      <LandingSearch />
      <div className='aLanding__list'>
        {albums.map((a, k) => (
          <LazyLoad key={k} placeholder={<LazyLoadPlaceholder />}>
            <Link
              to={{
                pathname: `/view/album/${a.albumName}`,
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
