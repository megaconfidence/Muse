import React from 'react';
import ListLanding from '../components/ListLanding';

function Artist({location, songs}) {
  return (
      <div className='artist'>
        <ListLanding songs={songs} path={location.pathname.replace('/', '')} />
      </div>
  );
}

export default Artist;
