import React from 'react';
import AlbumsLanding from '../components/AlbumsLanding';

function Albums({ location }) {
  return (
    <div className='albums'>
      <AlbumsLanding
        path={location.pathname.replace('/', '')}
      />
    </div>
  );
}

export default Albums;
