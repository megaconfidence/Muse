import './LandingSearch.css';
import React, { useState } from 'react';
import { useRef } from 'react';
import useFilterModal from './hooks/useFilterModal';

const LandingSearch = ({ path, pageState, getSearchVal, setPageState }) => {
  const [searchValue, setSearchValue] = useState({ val: '' });
  const [showClose, setShowClose] = useState(false);
  const inputRef = useRef(null);
  const [FilterModal, setFilterModal] = useFilterModal();

  const handleSearchChange = ({ target }) => {
    setSearchValue({ val: target.value });
    if (target.value) {
      setShowClose(true);
    } else {
      setShowClose(false);
    }
    const duration = 500;
    clearTimeout(target._timer);
    target._timer = setTimeout(() => {
      getSearchVal(target.value.toLowerCase(), path);
    }, duration);
  };

  return (
    <div className='lSearch'>
      <FilterModal />
      {showClose ? (
        <div
          data-img
          data-imgname='close'
          className='lSearch__icon'
          onClick={() => {
            setShowClose(false);
            getSearchVal('', path);
            setSearchValue({ val: '' });
          }}
        />
      ) : (
        <div
          data-img
          data-imgname='search'
          className='lSearch__icon'
          onClick={() => {
            inputRef.current.focus();
          }}
        />
      )}
      <input
        type='text'
        ref={inputRef}
        value={searchValue.val}
        className='lSearch__input'
        onChange={handleSearchChange}
        placeholder={`Search ${path.toLowerCase()}...`}
      />

      <div
        data-img
        data-imgname='sort'
        style={{
          opacity: `${
            path === 'songs' || path === 'albums' || path === 'artists'
              ? '0'
              : '0.5'
          }`,
          pointerEvents: `${
            path === 'songs' || path === 'albums' || path === 'artists'
              ? 'none'
              : 'initial'
          }`
        }}
        className='lSearch__icon'
        onClick={() => {
          setFilterModal(pageState, setPageState);
          // filterList(path, undefined);
        }}
      />
    </div>
  );
};

export default LandingSearch;
