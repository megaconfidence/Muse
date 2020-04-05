import './ListLanding.css';
import { Link } from 'react-router-dom';
import LandingSearch from './LandingSearch';
import React, { useState, useCallback, useEffect } from 'react';

function ListLanding({ path, songs }) {
  const [allArtist, setAllArtist] = useState({ val: [] });
  console.log(path);
  const getArtist = useCallback(() => {
    const arr = [];
    if (path === 'artist') {
      for (const artist in songs) {
        arr.push(artist);
      }
    } else if (path === 'genre') {
      for (const ar in songs) {
        for (const a in songs[ar]) {
          if (songs[ar][a].albumGenre) {
            arr.push(songs[ar][a].albumGenre);
          }
        }
      }
    }

    setAllArtist({ val: [...new Set(arr)].sort() });
  }, [path, songs]);

  useEffect(() => {
    getArtist();
  }, [getArtist]);

  return (
    <div className='lLanding'>
      <LandingSearch path={path} />
      {allArtist.val.map((a, k) => (
        <Link
          key={k}
          to={{
            pathname: `/view/${path}/${a}`
          }}
        >
          <div className='lLanding__item truncate'>{a}</div>
        </Link>
      ))}
    </div>
  );
}

export default ListLanding;
