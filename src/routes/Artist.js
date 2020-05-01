import React from 'react';
import ListLanding from '../components/ListLanding';

function Artist({
  location,
  filterList,
}) {
  return (
    <div className='artist'>
      <ListLanding
        filterList={filterList}
        path={location.pathname.replace('/', '')}
      />
    </div>
  );
}

export default Artist;
