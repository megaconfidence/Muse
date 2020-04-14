import React from 'react';
import ViewLanding from '../components/ViewLanding';

function View({ location, songs, handleSetSongQueues,handleGroupContextMenueEvents, removeFromPlayList,addToPlayList, playList }) {
  const path = location.pathname.replace('/view/', '');
  return (
    <div className='view'>
      <ViewLanding
        path={path}
        songs={songs}
        playList={playList}
        addToPlayList={addToPlayList}
        removeFromPlayList={removeFromPlayList}
        handleGroupContextMenueEvents={handleGroupContextMenueEvents}
        handleSetSongQueues={handleSetSongQueues}
      />
    </div>
  );
}

export default View;
