import React from 'react';
import SearchLanding from '../components/SearchLanding';

function Search({
  filterList,
  handleSearch,
  songMatchDisplay,
  albumMatchDisplay,
  artistMatchDisplay,
  handleSetSongQueues
}) {
  return (
    <SearchLanding
      filterList={filterList}
      handleSearch={handleSearch}
      songMatchDisplay={songMatchDisplay}
      albumMatchDisplay={albumMatchDisplay}
      artistMatchDisplay={artistMatchDisplay}
      handleSetSongQueues={handleSetSongQueues}
    />
  );
}

export default Search;
