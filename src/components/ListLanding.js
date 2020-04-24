import './ListLanding.css';
import { Link } from 'react-router-dom';
import LandingSearch from './LandingSearch';
import React, { useState, useCallback, useEffect } from 'react';
import ObjectID from 'bson-objectid';
import SearchNotFound from './SearchNotFound';

function ListLanding({
  path,
  updateListLandingDisplay,
  handleSearch,
  listLandingDisplay,
  filterList
}) {

  const setSearch = useCallback((query, cat) => {
    handleSearch(query, cat);
  }, [handleSearch]);

  useEffect(() => {
    updateListLandingDisplay(path);
  }, [path, updateListLandingDisplay]);

  return (
    <div className='lLanding'>
      <LandingSearch
        path={path}
        filterList={filterList}
        getSearchVal={setSearch}
      />
      {listLandingDisplay.length ? (
        listLandingDisplay.map((a, k) => (
          <Link
            key={k}
            to={{
              pathname: `/view/${path}/${a}/${ObjectID()}`
            }}
          >
            <div className='lLanding__item truncate'>{a}</div>
          </Link>
        ))
      ) : (
        <SearchNotFound />
      )}
    </div>
  );
}

export default ListLanding;
