import React from 'react';
import QueueLanding from '../components/QueueLanding';
import { forwardRef } from 'react';

const Queues = forwardRef(
  (
    {
      playing,
      playList,
      playerRef,
      filterList,
      songQueues,
      deleteQueue,
      queueDisplay,
      addToPlayList,
      updateQueueDisplay,
      handleSetSongQueues,
    },
    ref
  ) => {
    return (
      <QueueLanding
        ref={ref}
        playing={playing}
        playList={playList}
        playerRef={playerRef}
        filterList={filterList}
        songQueues={songQueues}
        deleteQueue={deleteQueue}
        queueDisplay={queueDisplay}
        addToPlayList={addToPlayList}
        updateQueueDisplay={updateQueueDisplay}
        handleSetSongQueues={handleSetSongQueues}
      />
    );
  }
);

export default Queues;
