import React from 'react';
import AlbumsLanding from '../components/AlbumsLanding';

function Albums({ location, filterList }) {
  return (
    <div className='albums'>
      <AlbumsLanding
        filterList={filterList}
        path={location.pathname.replace('/', '')}
      />
    </div>
  );
}

export default Albums;
