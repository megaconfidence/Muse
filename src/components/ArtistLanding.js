import React, { useState, useCallback, useEffect } from 'react';
import './ArtistLanding.css';
import LandingSearch from './LandingSearch';
import { Link } from 'react-router-dom';

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
    <div className='aLanding'>
      <LandingSearch />
      {allArtist.val.map((a, k) => (
        <div key={k} className='aLanding__item truncate'>
          {' '}
          <Link
            to={{
              pathname: `/view/artist/${a}`
            }}
          >
            {a}
          </Link>
        </div>
      ))}
    </div>
  );
}

export default ArtistLanding;
