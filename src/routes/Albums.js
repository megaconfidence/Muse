import React from 'react';
import AlbumsLanding from '../components/AlbumsLanding';

function Albums({ location,handleSearch, updateAlbumsDisplay, albumsDisplay, filterList }) {
  return (
    <div className='albums'>
      <AlbumsLanding
        filterList={filterList}
        handleSearch={handleSearch}
        albumsDisplay={albumsDisplay}
        updateAlbumsDisplay={updateAlbumsDisplay}
        path={location.pathname.replace('/', '')}
      />
    </div>
  );
}

export default Albums;
