import './ListLanding.css';
import { Link } from 'react-router-dom';
import LandingSearch from './LandingSearch';
import React, { useState, useCallback, useRef, useEffect } from 'react';
// import SearchNotFound from './SearchNotFound';
import apolloClient from '../apolloClient';
import gql from 'graphql-tag';
import useError from './hooks/useError';
import InfiniteScroll from 'react-infinite-scroll-component';
import useSpinner from './hooks/useSpinner';

function ListLanding({ path }) {
  const page = useRef(0);
  const [list, setList] = useState([]);
  const listCache = useRef([]);
  const count = useRef(null);
  const [hasMore, setHasMore] = useState(true);
  const [ErrModal, showErrModal] = useError(
    'An error occured while trying to get Artists',
    reFetchList
  );
  const [Spinner, setIsLoading] = useSpinner(true);

  const fetchList = useCallback(async () => {
    try {
      setHasMore(true);
      setIsLoading(true);
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

        setIsLoading(false);
        listCache.current = listCache.current.concat(data.allArtists);
        setList(listCache.current);
      } else if (path === 'genre') {
        const { data } = await apolloClient.query({
          query: gql`
            query {
              allGenre(page: ${page.current}) {
                _id
                name
              }
            }
          `
        });

        setIsLoading(false);
        listCache.current = listCache.current.concat(data.allGenre);
        setList(listCache.current);
      }
      if (listCache.current.length === Number(count.current)) {
        setHasMore(false);
      }
    } catch (err) {
      console.log(err);
      showErrModal(true);
      setIsLoading(false);
    }
    // setList({ val: [...new Set(arr)].sort() });
  }, [path, setIsLoading, showErrModal]);

  function reFetchList() {
    fetchList();
  }
  const setSearch = useCallback(
    async (query, cat) => {
      console.log(query, cat);
      // handleSearch(query, cat);
      try {
        setList([]);
        setIsLoading(true);
        if (query) {
          setHasMore(false);
          if (cat === 'artist') {
            const { data } = await apolloClient.query({
              query: gql`
                query {
                  searchArtist(query: "${query}") {
                    _id
                    name
                  }
                }
              `
            });

            setIsLoading(false);
            setList(data.searchArtist);
          } else if (cat === 'genre') {
            const { data } = await apolloClient.query({
              query: gql`
                query {
                  searchGenre(query: "${query}") {
                    _id
                    name
                  }
                }
              `
            });

            setIsLoading(false);
            setList(data.searchGenre);
          }
        } else {
          fetchList();
        }
      } catch (err) {
        console.log(err);
        showErrModal(true);
        setIsLoading(false);
      }
    },
    [fetchList, setIsLoading, showErrModal]
  );

  useEffect(() => {
    fetchList();
    (async () => {
      // console.log(path)
      const { data } = await apolloClient.query({
        query: gql`
          query {
            count(type: "${path}") 
          }
        `
      });
      count.current = data.count;
    })();
  }, [fetchList, path]);

  return (
    <div className='lLanding'>
      <ErrModal />
      <LandingSearch
        path={path}
        getSearchVal={setSearch}
        pageState={list}
        setPageState={setList}
      />

      <Spinner />
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
                pathname: `/view/${path}/${a.name}/${a._id}`
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
