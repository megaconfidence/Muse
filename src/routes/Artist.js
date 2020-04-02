import React from 'react';
import ArtistLanding from '../components/ArtistLanding';

function Artist({songs}) {
  return (
      <div className='artist'>
        <ArtistLanding songs={songs} />
      </div>
  );
}

export default Artist;
