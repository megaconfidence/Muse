import './ArtistLanding.css';
import { Link } from 'react-router-dom';
import LandingSearch from './LandingSearch';
import React, { useState, useCallback, useEffect } from 'react';

function ArtistLanding({ songs }) {
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
        <Link
          key={k}
          to={{
            pathname: `/view/artist/${a}`
          }}
        >
          <div className='arLanding__item truncate'>{a}</div>
        </Link>
      ))}
    </div>
  );
}

export default ArtistLanding;
