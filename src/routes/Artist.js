import React from 'react';
import ListLanding from '../components/ListLanding';

function Artist({
  location,
  filterList,
  handleSearch,
}) {
  return (
    <div className='artist'>
      <ListLanding
        filterList={filterList}
        handleSearch={handleSearch}
        path={location.pathname.replace('/', '')}
      />
    </div>
  );
}

export default Artist;
