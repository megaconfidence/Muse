import React from 'react';
import './SearchNotFound.css'

const SearchNotFound = ({text}) => {
  return (
    <div className='not__found'>
      <div className='not__found__icon'>
        <div data-img data-imgname='search' />
      </div>
  <div className='not__found__text'>{text || 'No results found'}</div>
    </div>
  );
};
export default SearchNotFound;
