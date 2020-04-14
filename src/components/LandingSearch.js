import './LandingSearch.css';
import React, { useState } from 'react';

const LandingSearch = ({ path, getSearchVal }) => {
  const [searchValue, setSearchValue] = useState({ val: '' });

  const handleSearchChange = ({ target }) => {
    setSearchValue({ val: target.value });

    const duration = 500;
    clearTimeout(target._timer);
    target._timer = setTimeout(() => {
      getSearchVal(target.value);
    }, duration);
  };

  return (
    <div className='lSearch'>
      <div className='lSearch__icon' data-img data-imgname='search' />
      <input
        type='text'
        value={searchValue.val}
        className='lSearch__input'
        onChange={handleSearchChange}
        placeholder={`Search ${path}...`}
      />
      <div className='lSearch__icon' data-img data-imgname='sort' />
    </div>
  );
};

export default LandingSearch;
