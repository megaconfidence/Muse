import React from 'react';
import SearchLanding from '../components/SearchLanding';

function Search({ songs, handleSetSongQueues }) {
  return (
    <SearchLanding songs={songs} handleSetSongQueues={handleSetSongQueues} />
  );
}

export default Search;
