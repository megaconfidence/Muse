import React from 'react';
import ViewLanding from '../components/ViewLanding';

const View = ({
  location,
  filterList,
  showSongModal,
  addToPlayList,
  handleSetSongQueues,
  handleGroupContextMenueEvents
}) => {
  const path = location.pathname.replace('/view/', '');
  return (
    <div className='view'>
      <ViewLanding
        path={path}
        filterList={filterList}
        addToPlayList={addToPlayList}
        showSongModal={showSongModal}
        handleSetSongQueues={handleSetSongQueues}
        handleGroupContextMenueEvents={handleGroupContextMenueEvents}
      />
    </div>
  );
};
export default View;
