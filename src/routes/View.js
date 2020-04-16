import React from 'react';
import ViewLanding from '../components/ViewLanding';
import { forwardRef } from 'react';

const View = forwardRef(
  (
    {
      location,
      viewSongsDisplay,
      viewAlbumsDisplay,
      setViewDisplay,
      filterList,
      updateViewSongsDisplay,
      showSongModal,
      addToPlayList,
      handleSetSongQueues,
      handleGroupContextMenueEvents
    },
    ref
  ) => {
    const path = location.pathname.replace('/view/', '');
    return (
      <div className='view'>
        <ViewLanding
          path={path}
          viewSongsDisplay={viewSongsDisplay}
          ref={ref}
          filterList={filterList}
          setViewDisplay={setViewDisplay}
          viewAlbumsDisplay={viewAlbumsDisplay}
          updateViewSongsDisplay={updateViewSongsDisplay}
          addToPlayList={addToPlayList}
          showSongModal={showSongModal}
          handleSetSongQueues={handleSetSongQueues}
          handleGroupContextMenueEvents={handleGroupContextMenueEvents}
        />
      </div>
    );
  }
);

export default View;
