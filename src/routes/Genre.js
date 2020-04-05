import React from 'react';
import ListLanding from '../components/ListLanding';

function Genre({ location, songs }) {
  return (
    <div className='genre'>
      <ListLanding path={location.pathname.replace('/', '')} songs={songs} />
    </div>
  );
}

export default Genre;
