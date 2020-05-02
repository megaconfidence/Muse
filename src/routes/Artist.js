import React from 'react';
import ListLanding from '../components/ListLanding';

function Artist({
  location,
}) {
  return (
    <div className='artist'>
      <ListLanding
        path={location.pathname.replace('/', '')}
      />
    </div>
  );
}

export default Artist;
