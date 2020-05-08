import './SearchLanding.css';
import gql from 'graphql-tag';
import SongItem from './SongItem';
import { Link } from 'react-router-dom';
import useError from './hooks/useError';
import apolloClient from '../apolloClient';
import useSpinner from './hooks/useSpinner';
import LandingSearch from './LandingSearch';
import SearchNotFound from './SearchNotFound';
import useSongModal from './hooks/useSongModal';
import LazyLoad, { forceCheck } from 'react-lazyload';
import React, { useState, useRef, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

function SearchLanding() {
  const [path, setPath] = useState('songs');
  const [searchVal, setSearchVal] = useState('');
  const [dontShowSearchNotFound, setDontShowSearchNotFound] = useState(true);
  const [SongModal, showSongModal] = useSongModal();
  const count = useRef(null);
  const [displayResults, setDisplayResults] = useState(true);
  const [hasMoreForSongs, setHasMoreForSongs] = useState(true);
  const [hasMoreForAlbums, setHasMoreForAlbums] = useState(true);
  const [hasMoreForArtists, setHasMoreForArtists] = useState(true);

  const pageForSongs = useRef(0);
  const pageForArtists = useRef(0);
  const pageForAlbums = useRef(0);

  const songMatchDisplayCache = useRef([]);
  const albumMatchDisplayCache = useRef([]);
  const artistMatchDisplayCache = useRef([]);

  const songPane = useRef(null);
  const albumPane = useRef(null);
  const artistPane = useRef(null);
  const [ErrModal, showErrModal] = useError(
    'Could not perform search',
    setSearch
  );
  const [Spinner, setIsLoading] = useSpinner(false);
  const [songMatchDisplay, setSongMatchDisplay] = useState([]);
  const [albumMatchDisplay, setAlbumMatchDisplay] = useState([]);
  const [artistMatchDisplay, setArtistMatchDisplay] = useState([]);

  async function setSearch(query = searchVal, cat = path, fectchMore) {
    setIsLoading(true);
    setSearchVal(query);
    if (!fectchMore) {
      setDisplayResults(false);
      setSongMatchDisplay([]);
      setAlbumMatchDisplay([]);
      setArtistMatchDisplay([]);

      setHasMoreForSongs(true);
      setHasMoreForAlbums(true);
      setHasMoreForArtists(true);

      songMatchDisplayCache.current = [];
      albumMatchDisplayCache.current = [];
      artistMatchDisplayCache.current = [];

      const { data } = await apolloClient.query({
        query: gql`
          query {
            countSearch(type: "${cat}", query: "${query}") 
          }
        `
      });
      count.current = data.countSearch
    }
    try {
      if (cat === 'songs' && query) {
        pageForSongs.current += 1;
        const { data } = await apolloClient.query({
          query: gql`
            query {
              searchSongs(page: ${pageForSongs.current}, query: "${query}") {
                _id
                name
                playId
                duration
                artist {
                  name
                }
                album {
                  url
                  cover
                  name
                }  
              }
            }
          `,
        });

        if (data) {
          setHasMoreForSongs(true);
          setHasMoreForAlbums(false);
          setHasMoreForArtists(false);

          setIsLoading(false);
          setDisplayResults(true);
          songMatchDisplayCache.current = songMatchDisplayCache.current.concat(
            data.searchSongs
          );
          setSongMatchDisplay(songMatchDisplayCache.current);
          songPane.current.classList.remove('hide');
          albumPane.current.classList.add('hide');
          artistPane.current.classList.add('hide');
          if (songMatchDisplayCache.current.length === count.current) {
            setHasMoreForSongs(false);
          }
        }
      } else if (cat === 'albums' && query) {
        pageForAlbums.current += 1;
        const { data } = await apolloClient.query({
          query: gql`
            query {
              searchAlbums(page: ${pageForAlbums.current}, query: "${query}") {
                _id
                name
              }
            }
          `,
        });

        if (data) {
          setHasMoreForSongs(false);
          setHasMoreForAlbums(true);
          setHasMoreForArtists(false);

          setIsLoading(false);
          setDisplayResults(true);
          albumMatchDisplayCache.current = albumMatchDisplayCache.current.concat(
            data.searchAlbums
          );
          setAlbumMatchDisplay(albumMatchDisplayCache.current);
          songPane.current.classList.add('hide');
          albumPane.current.classList.remove('hide');
          artistPane.current.classList.add('hide');

          if (albumMatchDisplayCache.current.length === count.current) {
            setHasMoreForAlbums(false);
          }
        }
      } else if (cat === 'artists' && query) {
        pageForArtists.current += 1;
        const { data } = await apolloClient.query({
          query: gql`
            query {
              searchArtist(page: ${pageForArtists.current}, query: "${query}") {
                _id
                name
              }
            }
          `,
        });

        if (data) {
          setHasMoreForSongs(false);
          setHasMoreForAlbums(false);
          setHasMoreForArtists(true);

          setIsLoading(false);
          setDisplayResults(true);
          artistMatchDisplayCache.current = artistMatchDisplayCache.current.concat(
            data.searchArtist
          );
          setArtistMatchDisplay(artistMatchDisplayCache.current);
          songPane.current.classList.add('hide');
          albumPane.current.classList.add('hide');
          artistPane.current.classList.remove('hide');

          if (artistMatchDisplayCache.current.length === count.current) {
            setHasMoreForArtists(false);
          }
        }
      } else if (!query) {
        setIsLoading(false);
        setDisplayResults(true);
        setSongMatchDisplay([]);
        setAlbumMatchDisplay([]);
        setArtistMatchDisplay([]);

        setHasMoreForSongs(false);
        setHasMoreForAlbums(false);
        setHasMoreForArtists(false);

        songMatchDisplayCache.current = [];
        albumMatchDisplayCache.current = [];
        artistMatchDisplayCache.current = [];
      }
      showErrModal(false);
    } catch (err) {
      showErrModal(true);
      setIsLoading(false);
      console.log(err);
    }
    // handleSearch(query, 'search');
  }

  useEffect(() => {
    forceCheck();
  }, [path]);

  useEffect(() => {
    setTimeout(() => {
      forceCheck();
    }, 500);
  }, []);

  useEffect(() => {
    if (!songMatchDisplay.length && path === 'songs') {
      setDontShowSearchNotFound(false);
    } else if (!albumMatchDisplay.length && path === 'albums') {
      setDontShowSearchNotFound(false);
    } else if (!artistMatchDisplay.length && path === 'artists') {
      setDontShowSearchNotFound(false);
    } else {
      setDontShowSearchNotFound(true);
    }
  }, [albumMatchDisplay, artistMatchDisplay, path, songMatchDisplay]);
  const showCategory = ({ target }) => {
    document.querySelectorAll('.shLanding__tab__item').forEach((tab) => {
      if (tab.id !== target.id) {
        tab.classList.remove('shLanding__tab__item--active');
      } else {
        tab.classList.add('shLanding__tab__item--active');
      }
      setPath(target.id);
      setSearch(searchVal, target.id);

      if (target.id === 'songs') {
        songPane.current.classList.remove('hide');
        albumPane.current.classList.add('hide');
        artistPane.current.classList.add('hide');
      }
      if (target.id === 'albums') {
        songPane.current.classList.add('hide');
        albumPane.current.classList.remove('hide');
        artistPane.current.classList.add('hide');
      }
      if (target.id === 'artists') {
        songPane.current.classList.add('hide');
        albumPane.current.classList.add('hide');
        artistPane.current.classList.remove('hide');
      }
    });
  };

  return (
    <div className='shLanding'>
      <ErrModal />
      <SongModal />
      <LandingSearch getSearchVal={setSearch} path={path} />
      <div className='shLanding__tab'>
        <div
          id='songs'
          className='shLanding__tab__item shLanding__tab__item--active noselect'
          onClick={showCategory}
        >
          Songs
        </div>{' '}
        <div
          id='albums'
          className='shLanding__tab__item noselect'
          onClick={showCategory}
        >
          Albums
        </div>{' '}
        <div
          id='artists'
          className='shLanding__tab__item noselect'
          onClick={showCategory}
        >
          Artists
        </div>
      </div>

      <Spinner />
      {displayResults ? (
        <>
          {' '}
          <div className='shLanding__songPane' ref={songPane}>
            <div className='shLanding__songs__list'>
              {dontShowSearchNotFound ? (
                <InfiniteScroll
                  next={() => {
                    setSearch(searchVal, 'songs', true);
                  }}
                  hasMore={hasMoreForSongs}
                  dataLength={songMatchDisplay.length}
                  loader={
                    <div className='infinite__scroll__loader' key={0}>
                      <div data-img data-imgname='loading' />
                    </div>
                  }
                >
                  {songMatchDisplay.map((s, k) => (
                    <LazyLoad key={k} placeholder={<div>***</div>}>
                      <SongItem
                        s={s}
                        cat={'search'}
                        queueId={s.queueId}
                        showSongModal={showSongModal}
                      />
                    </LazyLoad>
                  ))}
                </InfiniteScroll>
              ) : searchVal.length ? (
                <SearchNotFound />
              ) : (
                <SearchNotFound text={`search for ${path}`} />
              )}
            </div>
          </div>
          <div className='shLanding__albumPane hide' ref={albumPane}>
            {dontShowSearchNotFound ? (
              <InfiniteScroll
                next={() => {
                  setSearch(searchVal, 'albums', true);
                }}
                hasMore={hasMoreForAlbums}
                dataLength={albumMatchDisplay.length}
                loader={
                  <div className='infinite__scroll__loader' key={0}>
                    <div data-img data-imgname='loading' />
                  </div>
                }
              >
                {albumMatchDisplay.map((a, k) => (
                  <Link
                    key={k}
                    to={{
                      pathname: `/view/album/${a.name}/${a._id}`,
                    }}
                  >
                    <div className='shLanding__pane__item truncate'>
                      {a.name}
                    </div>
                  </Link>
                ))}
              </InfiniteScroll>
            ) : searchVal.length ? (
              <SearchNotFound />
            ) : (
              <SearchNotFound text={`search for ${path}`} />
            )}
          </div>
          <div className='shLanding__artistPane hide' ref={artistPane}>
            {dontShowSearchNotFound ? (
               <InfiniteScroll
               next={() => {
                 setSearch(searchVal, 'artists', true);
               }}
               hasMore={hasMoreForArtists}
               dataLength={artistMatchDisplay.length}
               loader={
                 <div className='infinite__scroll__loader' key={0}>
                   <div data-img data-imgname='loading' />
                 </div>
               }
             >
              {artistMatchDisplay.map((a, k) => (
                <Link
                  key={k}
                  to={{
                    pathname: `/view/artist/${a.name}/${a._id}`,
                  }}
                >
                  <div className='shLanding__pane__item truncate'>{a.name}</div>
                </Link>
              ))}
                </InfiniteScroll>
            ) : searchVal.length ? (
              <SearchNotFound />
            ) : (
              <SearchNotFound text={`search for ${path}`} />
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}

export default SearchLanding;
