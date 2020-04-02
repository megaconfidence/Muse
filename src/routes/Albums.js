import React from 'react';
import AlbumsLanding from '../components/AlbumsLanding';

function Albums({albums}) {
  return (
      <div className='albums'>
        <AlbumsLanding albums={albums} />
      </div>
  );
}

export default Albums;
