import React from 'react';
import PlayListLanding from '../components/PlayListLanding';
function PlayLists({ createPlayList, getPlayList, playList }) {
  return (
    <div className='playLists'>
      <PlayListLanding
        playList={playList}
        getPlayList={getPlayList}
        createPlayList={createPlayList}
      />
    </div>
  );
}

export default PlayLists;
