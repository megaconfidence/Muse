import React from 'react';
import AlbumsLanding from '../components/AlbumsLanding';

function Albums({ location, albums }) {
  return (
    <div className='albums'>
      <AlbumsLanding
        albums={albums}
        path={location.pathname.replace('/', '')}
      />
    </div>
  );
}

export default Albums;
