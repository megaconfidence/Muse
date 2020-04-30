import React from 'react';
import AlbumsLanding from '../components/AlbumsLanding';

function Albums({ location, handleSearch, filterList }) {
  return (
    <div className='albums'>
      <AlbumsLanding
        filterList={filterList}
        handleSearch={handleSearch}
        path={location.pathname.replace('/', '')}
      />
    </div>
  );
}

export default Albums;
