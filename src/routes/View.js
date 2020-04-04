import React from 'react';
import ViewLanding from '../components/ViewLanding';

function View({ location, songs, handleSetSongQueues, songQueues }) {
  const path = location.pathname.replace('/view/', '');
  return (
    <div className='view'>
      <ViewLanding
        path={path}
        songs={songs}
        songQueues={songQueues}
        handleSetSongQueues={handleSetSongQueues}
      />
    </div>
  );
}

export default View;
