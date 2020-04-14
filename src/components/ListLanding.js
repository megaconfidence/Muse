import './ListLanding.css';
import { Link } from 'react-router-dom';
import LandingSearch from './LandingSearch';
import React, { useState, useCallback, useEffect } from 'react';
import ObjectID from 'bson-objectid';
import SearchNotFound from './SearchNotFound';

function ListLanding({ path, songs }) {
  const [allArtist, setAllArtist] = useState({ val: [] });
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

  const getSearchVal = val => {
    const arr = [];
    if (path === 'artist') {
      for (const artist in songs) {
        if (artist.includes(val)) {
          arr.push(artist);
        }
      }
    } else if (path === 'genre') {
      for (const ar in songs) {
        for (const a in songs[ar]) {
          if (songs[ar][a].albumGenre) {
            if (songs[ar][a].albumGenre.includes(val)) {
              arr.push(songs[ar][a].albumGenre);
            }
          }
        }
      }
    }
    setAllArtist({ val: [...new Set(arr)].sort() });
  };
  useEffect(() => {
    getArtist();
  }, [getArtist]);

  return (
    <div className='lLanding'>
      <LandingSearch path={path} getSearchVal={getSearchVal} />
      {allArtist.val.length ? (
        allArtist.val.map((a, k) => (
          <Link
            key={k}
            to={{
              pathname: `/view/${path}/${a}/${ObjectID()}`
            }}
          >
            <div className='lLanding__item truncate'>{a}</div>
          </Link>
        ))
      ) : (
        <SearchNotFound />
      )}
    </div>
  );
}

export default ListLanding;
