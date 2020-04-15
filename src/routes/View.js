import React from 'react';
import ViewLanding from '../components/ViewLanding';

function View({
  songs,
  location,
  playList,
  addToPlayList,
  removeFromPlayList,
  handleSetSongQueues,
  handleGroupContextMenueEvents
}) {
  const path = location.pathname.replace('/view/', '');
  return (
    <div className='view'>
      <ViewLanding
        path={path}
        songs={songs}
        playList={playList}
        addToPlayList={addToPlayList}
        removeFromPlayList={removeFromPlayList}
        handleSetSongQueues={handleSetSongQueues}
        handleGroupContextMenueEvents={handleGroupContextMenueEvents}
      />
    </div>
  );
}

export default View;
