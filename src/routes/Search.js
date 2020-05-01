import React from 'react';
import SearchLanding from '../components/SearchLanding';

function Search({
  filterList,
  showSongModal,
  handleSetSongQueues
}) {
  return (
    <SearchLanding
      filterList={filterList}
      showSongModal={showSongModal}
      handleSetSongQueues={handleSetSongQueues}
    />
  );
}

export default Search;
