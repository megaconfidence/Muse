import React from 'react';
import ListLanding from '../components/ListLanding';

function Genre({
  location,
  filterList,
  handleSearch,
  listLandingDisplay,
  updateListLandingDisplay,
}) {
  return (
    <div className='genre'>
      <ListLanding
        filterList={filterList}
        handleSearch={handleSearch}
        listLandingDisplay={listLandingDisplay}
        path={location.pathname.replace('/', '')}
        updateListLandingDisplay={updateListLandingDisplay}
      />
    </div>
  );
}

export default Genre;
