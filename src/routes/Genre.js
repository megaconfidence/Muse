import React from 'react';
import ListLanding from '../components/ListLanding';

function Genre({
  location,
  filterList,
}) {
  return (
    <div className='genre'>
      <ListLanding
        filterList={filterList}
        path={location.pathname.replace('/', '')}
      />
    </div>
  );
}

export default Genre;
