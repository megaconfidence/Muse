import React from 'react';
import ListLanding from '../components/ListLanding';

function Artist({
  location,
  filterList,
  handleSearch,
  listLandingDisplay,
  updateListLandingDisplay
}) {
  return (
    <div className='artist'>
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

export default Artist;
