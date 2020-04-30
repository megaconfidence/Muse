import './ListLanding.css';
import { Link } from 'react-router-dom';
import LandingSearch from './LandingSearch';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import ObjectID from 'bson-objectid';
// import SearchNotFound from './SearchNotFound';
import apolloClient from '../apolloClient';
import gql from 'graphql-tag';
import useError from './hooks/useError';
import InfiniteScroll from 'react-infinite-scroll-component';

function ListLanding({ path, handleSearch, filterList }) {
  const page = useRef(0);
  const [list, setList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const listCache = useRef([]);
  const [ErrModal, showErrModal] = useError(
    'An error occured while trying to get Artists',
    reFetchList
  );

  const setSearch = useCallback(
    (query, cat) => {
      handleSearch(query, cat);
    },
    [handleSearch]
  );

  const fetchList = useCallback(async () => {
    try {
      page.current = page.current + 1;
      if (path === 'artist') {
        const { data } = await apolloClient.query({
          query: gql`
          query {
            allArtists(page: ${page.current}) {
              _id
              name
            }
          }
        `
        });

        if (data) {
          listCache.current = listCache.current.concat(data.allArtists);
          setList(listCache.current);
        }
      } else if (path === 'genre') {
        setHasMore(false);
        const { data } = await apolloClient.query({
          query: gql`
            query {
              allGenre {
                name
              }
            }
          `
        });

        if (data) {
          setList(data.allGenre);
        }
      }
    } catch (err) {
      showErrModal(true);
      console.log(err);
    }
    // setList({ val: [...new Set(arr)].sort() });
  }, [path, showErrModal]);

  function reFetchList() {
    fetchList();
  }
  useEffect(() => {
    fetchList();
  }, [fetchList]);
  return (
    <div className='lLanding'>
      <ErrModal />
      <LandingSearch
        path={path}
        filterList={filterList}
        getSearchVal={setSearch}
      />

      <InfiniteScroll
        next={fetchList}
        hasMore={hasMore}
        dataLength={list.length}
        loader={
          <div className='infinite__scroll__loader' key={0}>
            <div data-img data-imgname='loading' />
          </div>
        }
      >
        {
          // list.length ? (
          list.map((a, k) => (
            <Link
              key={k}
              to={{
                pathname: `/view/${path}/${a.name}/${a._id || ObjectID()}`
              }}
            >
              <div className='lLanding__item truncate'>{a.name}</div>
            </Link>
          ))
          // ) : (
          //   <SearchNotFound />
          // )
        }
      </InfiniteScroll>
    </div>
  );
}

export default ListLanding;
