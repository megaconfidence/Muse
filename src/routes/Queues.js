import React from 'react';
import QueueLanding from '../components/QueueLanding';

function Queues({songQueues,playing,playerRef, savePlayingSongQueues, playList, handleSetSongQueues}) {
  return (
      <QueueLanding songQueues={songQueues} playerRef={playerRef} playList={playList} savePlayingSongQueues={savePlayingSongQueues} handleSetSongQueues={handleSetSongQueues} playing={playing} />
  );
}

export default Queues;
