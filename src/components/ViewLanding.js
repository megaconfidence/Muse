import React, { useRef, useState, useEffect, useCallback } from 'react';
import './ViewLanding.css';
import gql from 'graphql-tag';
import InfoCard from './InfoCard';
import SongItem from './SongItem';
import { useContext } from 'react';
import useError from './hooks/useError';
import apolloClient from '../apolloClient';
import AppContext from './hooks/AppContext';
import useSpinner from './hooks/useSpinner';
import { withRouter } from 'react-router-dom';
import useSongModal from './hooks/useSongModal';
import GroupContextMenue from './GroupContextMenue';
import useFilterModal from './hooks/useFilterModal';
import LazyLoad, { forceVisible } from 'react-lazyload';
import InfiniteScroll from 'react-infinite-scroll-component';

const ViewLanding = ({ path, history }) => {
  path = path.split('/');
  const cat = path[0];
  const catName = path[1];
  const catId = path[2];
  const page = useRef(0);
  const [Spinner, setIsLoading] = useSpinner(true);
  const groupContextMenueRef = useRef(null);
  const [viewSongs, setViewSongs] = useState([]);
  const [ErrModal, showErrModal] = useError(
    'An error occured while trying to get Albums',
    refetchView
  );
  const [appData] = useContext(AppContext);
  const [SongModal, showSongModal] = useSongModal();
  const [FilterModal, setFilterModal] = useFilterModal();
  const [hasMore, setHasMore] = useState(false);

  const [viewAlbums, setViewAlbums] = useState([]);
  const songsCache = useRef([]);
  const count = useRef(null);

  const handleListCardClick = (i) => {
    if (cat === 'album') {
      document
        .querySelectorAll('.vLanding__info__list__card')
        .forEach((e, k) => {
          if (k === i) {
            e.classList.add('vLanding__info__list__card--select');
            if (i === 0) {
              /**
               * Do nothing if first or second card is clicked
               */
              setViewSongs(songsCache.current);
            } else {
              /**
               * Show songs containing card name
               */
              const arr = [];
              setViewSongs([]);
              const cardName = e.textContent.toLowerCase();

              songsCache.current.forEach((s) => {
                if (s.name.toLowerCase().includes(cardName)) {
                  arr.push(s);
                }
                // const re = /fe?a?t\.?\s/g;
                // s.name = s.name.replace(/[^a-zA-Z0-9 \-$]/g, '');
                // if (
                //   re.test(s.name) &&
                //   s.name.search(re) < s.name.lastIndexOf(cardName)
                // ) {
                //   arr.push(s);
                // }
              });
              setTimeout(() => {
                if (arr.length) {
                  setViewSongs(arr);
                } else {
                  setViewSongs(viewSongs);
                }
              }, 1000);
            }
          } else {
            e.classList.remove('vLanding__info__list__card--select');
          }
        });
    } else if (cat === 'artist' || cat === 'genre' || cat === 'recents') {
      document
        .querySelectorAll('.vLanding__info__list__card')
        .forEach((e, k) => {
          if (k === i) {
            e.classList.add('vLanding__info__list__card--select');
            if (i === 0) {
              /**
               * Do nothing if first card is clicked
               */
              setViewSongs(songsCache.current);
            } else {
              /**
               * Show songs containing card name
               */
              const arr = [];
              setViewSongs([]);
              const cardName = e.textContent.toLowerCase();

              songsCache.current.forEach((s) => {
                if (s.album.name.includes(cardName)) {
                  arr.push(s);
                }
              });

              setTimeout(() => {
                if (arr.length) {
                  setViewSongs(arr);
                } else {
                  setViewSongs(viewAlbums);
                }
              }, 1000);
            }
          } else {
            e.classList.remove('vLanding__info__list__card--select');
          }
        });
    }
  };

  const forceLazy = () => {
    setTimeout(() => {
      forceVisible();
    }, 1000);
  };

  const fetchGenreSongs = useCallback(async () => {
    try {
      setIsLoading(true);
      page.current += 1;

      const { data } = await apolloClient.query({
        query: gql`
          query {
            songs: genreSongs(id: "${catId}", page: ${page.current}) {
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
                genre {
                  name
                }
              }
              }
            }
        `,
      });

      setIsLoading(false);
      const songs = data.songs;
      songsCache.current = songsCache.current.concat(songs);
      setViewSongs(songsCache.current);
      if (songsCache.current.length === count.current) {
        setHasMore(false);
      }
    } catch (err) {
      console.log(err);
      showErrModal(true);
      setIsLoading(false);
    }
  }, [catId, setIsLoading, showErrModal]);

  const fetchView = useCallback(async () => {
    setIsLoading(true);
    try {
      if (cat === 'album') {
        const { data } = await apolloClient.query({
          query: gql`
        query {
          album(_id: "${catId}") {
            _id
            songs {
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
                genre {
                  name
                }
              }
            }
          }
         }
    `,
        });

        if (data) {
          setIsLoading(false);
          const songs = data.album.songs;
          songsCache.current = songs;
          setViewSongs(songs);

          /**
           * The below block generates card from song names containing feat or ft
           */
          const arr = [];
          const uniqueArr = [];

          songs.forEach((ss) => {
            let { name } = ss;
            const re = /[^le]fe?a?t\.?\s/g;

            if (re.test(name)) {
              const typ = name.includes('feat') ? 'feat' : 'ft';
              name = name.split(typ)[1];
              const save = (v) => {
                arr.push({
                  name: v.replace(/[^a-zA-Z0-9 \-$]/g, '').trim(),
                  cover: ss.album.cover,
                });
              };

              name.split(/[&,]+/).forEach((n) => {
                save(n);
              });
            }
          });
          const map = new Map();
          for (const i of arr) {
            if (!map.has(i.name)) {
              map.set(i.name, true);
              uniqueArr.push({
                name: i.name,
                cover: i.cover,
              });
            }
          }
          setViewAlbums(uniqueArr);
          /**
           * End of card generation block
           */
        }
      } else if (cat === 'artist') {
        const { data } = await apolloClient.query({
          query: gql`
        query {
          artist(_id: "${catId}") {
            _id
            album {
              cover
              name
            }
            songs {
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
                genre {
                  name
                }
              }
            }
          }
         }
    `,
        });

        if (data) {
          setIsLoading(false);
          const songs = data.artist.songs;
          setViewSongs(songs);
          songsCache.current = songs;
          setViewAlbums([...new Set(data.artist.album)]);
        }
      } else if (cat === 'genre') {
        //   const { data } = await apolloClient.query({
        //       query: gql`
        //     query {
        //       genre(_id: "${catId}") {
        //         _id
        //         album {
        //           cover
        //           name
        //         }

        //       }
        //     }
        // `,
        //     });

        const countData = await apolloClient.query({
          query: gql`
        query {
          genreSongsCount(id: "${catId}") 
         }
    `,
        });

        count.current = countData.data.genreSongsCount;
        setHasMore(true);
        fetchGenreSongs();

        // if (data) {
        //   setViewAlbums(data.genre.album);
        // }
      } else if (cat === 'playlist') {
        for (const p in appData.playlist) {
          if (appData.playlist[p]._id === catId) {
            const pListSongs = appData.playlist[p].songs;
            if (pListSongs) {
              songsCache.current = pListSongs;
              setViewSongs(pListSongs);
            }
          }
        }
        forceLazy();
        setIsLoading(false);
      } else if (cat === 'favorites') {
        setIsLoading(false);
        setViewSongs(appData.likes);
        forceLazy();
      } else if (cat === 'recents') {
        const recents = appData.recents;
        if (recents) {
          setViewSongs(recents);
          songsCache.current = recents;
          const result = [];
          const map = new Map();
          for (const s of recents) {
            if (!map.has(s.album)) {
              map.set(s.album, true); // set any value to Map
              result.push({ name: s.album.name.trim(), cover: s.album.cover });
            }
          }
          setViewAlbums(result);
        }
        forceLazy();
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
      showErrModal(true);
      setIsLoading(false);
    }
  }, [
    appData.likes,
    appData.playlist,
    appData.recents,
    cat,
    catId,
    fetchGenreSongs,
    setIsLoading,
    showErrModal,
  ]);

  async function refetchView() {
    fetchView();
  }

  useEffect(() => {
    fetchView();
  }, [cat, fetchView]);

  return (
    <div className='vLanding'>
      <ErrModal />
      <SongModal />
      <FilterModal />
      <GroupContextMenue
        cat={cat}
        history={history}
        catId={catId}
        catName={catName}
        songs={viewSongs}
        ref={groupContextMenueRef}
      />

      <div className='vLanding__nav'>
        <div
          data-img
          onClick={() => {
            if (cat !== 'playlist') {
              history.goBack();
            } else {
              history.push('/playlists');
            }

            // if (cat === 'favorites' || cat === 'recents' || cat === 'playlist') {
            //   history.goBack('/playlists');
            // } else {
            //   history.push(`/${cat}`);
            // }
          }}
          data-imgname='arrow_left'
          className='vLanding__nav__icon'
        />
        <div className='vLanding__nav__text truncate'>{catName}</div>
        <div
          data-img
          data-imgname='settings'
          style={{ opacity: 0.1 }}
          className='vLanding__nav__icon'
        />
      </div>
      {cat !== 'playlist' && cat !== 'favorites' && cat !== 'genre' ? (
        <InfoCard
          cat={cat}
          viewSongsDisplay={viewSongs}
          viewAlbumsDisplay={viewAlbums}
          handleListCardClick={handleListCardClick}
        />
      ) : null}
      <div className='vLanding__songs'>
        <div className='vLanding__songs__control'>
          <div data-img data-imgname='repeat' style={{ opacity: 0.1 }} />
          <div
            data-img
            data-imgname='sort'
            onClick={() => {
              setFilterModal(viewSongs, setViewSongs);
            }}
          />
          <div
            data-img
            data-imgname='menu_horizontal'
            onClick={() => {
              groupContextMenueRef.current.classList.remove('hide');
            }}
          />
        </div>

        <div className='vLanding__songs__list'>
          <Spinner />
          <InfiniteScroll
            hasMore={hasMore}
            next={() => {
              if (cat === 'genre') {
                fetchGenreSongs();
              } else {
                // fetchView()
              }
            }}
            dataLength={viewSongs.length}
            className={'aLanding__list--scroller'}
            loader={
              <div className='infinite__scroll__loader' key={0}>
                <div data-img data-imgname='loading' />
              </div>
            }
          >
            {cat === 'genre'
              ? viewSongs.map((s, k) => (
                  <SongItem
                    s={s}
                    key={k}
                    cat={cat}
                    catId={catId}
                    showSongModal={showSongModal}
                  />
                ))
              : viewSongs.map((s, k) => (
                  <LazyLoad key={k} placeholder={<div>***</div>}>
                    <SongItem
                      s={s}
                      cat={cat}
                      catId={catId}
                      showSongModal={showSongModal}
                    />
                  </LazyLoad>
                ))}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};
export default withRouter(ViewLanding);
