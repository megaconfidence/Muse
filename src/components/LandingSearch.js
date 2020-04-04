import './LandingSearch.css';
import React, { useState } from 'react';

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
        value={searchValue.val}
        className='lSearch__input'
        onChange={handleSearchChange}
        placeholder='Search an album...'
      />
      <div className='lSearch__icon' data-img data-imgname='sort' />
    </div>
  );
}

export default LandingSearch;
