import React, { useState } from 'react';
import './LandingSearch.css';

function LandingSearch() {
  const [searchValue, setSearchValue] = useState({ val: '' });
  const handleSearchChange = ({ target }) => {
    setSearchValue({ val: target.value });
  };
  return (
    <div className='lSearch'>
      <div className='lSearch__icon' data-img data-imgname='search' />
      <input
        type='text'
        placeholder='Search an album...'
        className='lSearch__input'
        value={searchValue.val}
        onChange={handleSearchChange}
      />
      <div className='lSearch__icon' data-img data-imgname='sort' />
    </div>
  );
}

export default LandingSearch;
