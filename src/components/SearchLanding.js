import LandingSearch from './LandingSearch';
import './SearchLanding.css';
import SongItem from './SongItem';
import React, { useState, useRef } from 'react';
import LazyLoad, { forceCheck } from 'react-lazyload';
import { Link } from 'react-router-dom';
import SearchNotFound from './SearchNotFound';
import { useEffect } from 'react';
import { useCallback } from 'react';
import apolloClient from '../apolloClient';
import gql from 'graphql-tag';
import useSpinner from './hooks/useSpinner';
import useError from './hooks/useError';
import useSongModal from './hooks/useSongModal';

function SearchLanding() {
  const [path, setPath] = useState('songs');
  const [searchVal, setSearchVal] = useState('');
  const [dontShowSearchNotFound, setDontShowSearchNotFound] = useState(true);
  const [SongModal, showSongModal] = useSongModal();


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

  async function setSearch(query = searchVal, cat = path) {
    setSearchVal(query);
    setIsLoading(true);
    try {
      if (cat === 'songs' && query) {
        const { data } = await apolloClient.query({
          query: gql`
            query {
              searchSongs(query: "${query}") {
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
          `
        });

        if (data) {
          setIsLoading(false);
          setSongMatchDisplay(data.searchSongs);
        }
      } else if (cat === 'albums' && query) {
        const { data } = await apolloClient.query({
          query: gql`
            query {
              searchAlbums(query: "${query}") {
                _id
                name
              }
            }
          `
        });

        if (data) {
          setIsLoading(false);
          setAlbumMatchDisplay(data.searchAlbums);
        }
      } else if (cat === 'artists' && query) {
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

        if (data) {
          setIsLoading(false);
          setArtistMatchDisplay(data.searchArtist);
        }
      } else if (!query) {
        setIsLoading(false);
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
      <LandingSearch
        getSearchVal={setSearch}
        path={path}
      
      />
      <div className='shLanding__tab'>
        <div
          id='songs'
          className='shLanding__tab__item shLanding__tab__item--active'
          onClick={showCategory}
        >
          Songs
        </div>{' '}
        <div
          id='albums'
          className='shLanding__tab__item '
          onClick={showCategory}
        >
          Albums
        </div>{' '}
        <div
          id='artists'
          className='shLanding__tab__item'
          onClick={showCategory}
        >
          Artists
        </div>
      </div>

      <Spinner />
      <div className='shLanding__songPane' ref={songPane}>
        <div className='shLanding__songs__list'>
          {dontShowSearchNotFound ? (
            songMatchDisplay.map((s, k) => (
              <LazyLoad key={k} placeholder={<div>***</div>}>
                <SongItem
                  s={s}
                  cat={'search'}
                  queueId={s.queueId}
                  showSongModal={showSongModal}
                />
              </LazyLoad>
            ))
          ) : searchVal.length ? (
            <SearchNotFound />
          ) : (
            <SearchNotFound text={`search for ${path}`} />
          )}
        </div>
      </div>
      <div className='shLanding__albumPane hide' ref={albumPane}>
        {dontShowSearchNotFound ? (
          albumMatchDisplay.map((a, k) => (
            <Link
              key={k}
              to={{
                pathname: `/view/album/${a.name}/${a._id}`
              }}
            >
              <div className='shLanding__pane__item truncate'>{a.name}</div>
            </Link>
          ))
        ) : searchVal.length ? (
          <SearchNotFound />
        ) : (
          <SearchNotFound text={`search for ${path}`} />
        )}
      </div>
      <div className='shLanding__artistPane hide' ref={artistPane}>
        {dontShowSearchNotFound ? (
          artistMatchDisplay.map((a, k) => (
            <Link
              key={k}
              to={{
                pathname: `/view/artist/${a.name}/${a._id}`
              }}
            >
              <div className='shLanding__pane__item truncate'>{a.name}</div>
            </Link>
          ))
        ) : searchVal.length ? (
          <SearchNotFound />
        ) : (
          <SearchNotFound text={`search for ${path}`} />
        )}
      </div>
    </div>
  );
}

export default SearchLanding;
