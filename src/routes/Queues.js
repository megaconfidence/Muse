import React from 'react';
import QueueLanding from '../components/QueueLanding';
import { forwardRef } from 'react';

const  Queues = forwardRef(({songQueues,playing ,playerRef, savePlayingSongQueues, playList,addToPlayList,  deleteQueue, handleSetSongQueues}, ref) => {
  return (
      <QueueLanding songQueues={songQueues} addToPlayList={addToPlayList} deleteQueue={deleteQueue} ref={ref} playerRef={playerRef} playList={playList} savePlayingSongQueues={savePlayingSongQueues} handleSetSongQueues={handleSetSongQueues} playing={playing} />
  );
})

export default Queues;
