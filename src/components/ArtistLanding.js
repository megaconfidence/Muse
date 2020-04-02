import React, { useState, useCallback, useEffect } from 'react';
import './ArtistLanding.css';
import LandingSearch from './LandingSearch';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';


function ArtistLanding({ songs }) {
  // console.log(songs)
  const [allArtist, setAllArtist] = useState({ val: [] });
  const getArtist = useCallback(() => {
    const arr = [];
    for (const artist in songs) {
      arr.push(artist);
    }
    setAllArtist({ val: arr });
  }, [songs]);
  useEffect(() => {
      getArtist();
    }, [getArtist]);
  return (
      
    <div className='arLanding'>
      <LandingSearch />
      {allArtist.val.map((a, k) => (
        <LazyLoad key={k} placeholder='***'>
          <Link
            key={k}
            to={{
              pathname: `/view/artist/${a}`
            }}
          >
            <div className='arLanding__item truncate'>{a}</div>
          </Link>
        </LazyLoad>
      ))}
    </div>
  );
}

export default ArtistLanding;
