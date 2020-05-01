import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useCallback
} from 'react';
import './ViewLanding.css';
import InfoCard from './InfoCard';
import SongItem from './SongItem';
import apolloClient from '../apolloClient';
import gql from 'graphql-tag';
import config from 'environment';
import LazyLoad from 'react-lazyload';
import { withRouter } from 'react-router-dom';
import GroupContextMenue from './GroupContextMenue';
import InfiniteScroll from 'react-infinite-scroll-component';
import useError from './hooks/useError';
import useSpinner from './hooks/useSpinner';

const withRouterAndRef = (Wrapped) => {
  const WithRouter = withRouter(({ forwardRef, ...otherProps }) => (
    <Wrapped ref={forwardRef} {...otherProps} />
  ));
  const WithRouterAndRef = forwardRef((props, ref) => (
    <WithRouter {...props} forwardRef={ref} />
  ));
  const name = Wrapped.displayName || Wrapped.name;
  WithRouterAndRef.displayName = `withRouterAndRef(${name})`;
  return WithRouterAndRef;
};

const ViewLanding = ({
  path,
  history,
  addToPlayList,
  filterList,
  showSongModal,
  handleSetSongQueues,
  handleGroupContextMenueEvents
}) => {
  path = path.split('/');
  const cat = path[0];
  const catName = path[1];
  const catId = path[2];
  const page = useRef(0);
  const [Spinner, setIsLoading] = useSpinner(true);
  const [hasMore, setHasMore] = useState(false);
  const groupContextMenueRef = useRef(null);
  const [viewSongs, setViewSongs] = useState([]);
  const [ErrModal, showErrModal] = useError(
    'An error occured while trying to get Albums',
    refetchView
  );

  const [viewAlbums, setViewAlbums] = useState([]);
  const songsCache = useRef(null);

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
              if (arr.length) {
                setViewSongs(arr);
              } else {
                setViewSongs(viewSongs);
              }
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

              if (arr.length) {
                setViewSongs(arr);
              } else {
                setViewSongs(viewAlbums);
              }
            }
          } else {
            e.classList.remove('vLanding__info__list__card--select');
          }
        });
    }
  };

  const fetchView = useCallback(async () => {
    console.log('running');
    page.current = page.current + 1;
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
         }
    `
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
                  cover: ss.album.cover
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
                cover: i.cover
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
         }
    `
        });

        if (data) {
          setIsLoading(false);
          const songs = data.artist.songs;
          setViewSongs(songs);
          songsCache.current = songs;
          setViewAlbums([...new Set(data.artist.album)]);
        }
      } else if (cat === 'genre') {
        const { data } = await apolloClient.query({
          query: gql`
        query {
          genre(_id: "${catId}") {
            _id
            album {
              cover
              name
            }
            songs {
              _id
              name
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
         }
    `
        });

        if (data) {
          setIsLoading(false);
          const songs = data.genre.songs;
          setViewSongs(songs);
          songsCache.current = songs;
          setViewAlbums(data.genre.album);
        }
      } else if (cat === 'playlist') {
        // for (const p in playList.val) {
        //   if (playList.val[p]._id === catId) {
        //     const pListSongs = playList.val[p].songs;
        //     songsCache.current = pListSongs;
        //     setViewSongs({
        //       val: pListSongs
        //     });
        //   }
        // }
      } else if (cat === 'favorites') {
        let likes = localStorage.getItem(`${config.appName}_LIKES`);
        if (likes && likes !== 'undefined') {
          likes = JSON.parse(likes);
          songsCache.current = likes;
          setViewSongs(likes);
        }
      } else if (cat === 'recents') {
        let recents = localStorage.getItem(`${config.appName}_PLAYING_QUEUES`);
        if (recents && recents !== 'undefined') {
          recents = JSON.parse(recents);
          songsCache.current = recents;
          setViewSongs(recents);

          const result = [];
          const map = new Map();
          for (const s of recents) {
            if (!map.has(s.album)) {
              map.set(s.album, true); // set any value to Map
              result.push({ albumName: s.album.trim(), albumArt: s.cover });
            }
          }

          setViewAlbums(result);
        }
      }
      showErrModal(false);
    } catch (err) {
      console.log(err);
      showErrModal(true);
      setIsLoading(false);
    }
  }, [cat, catId, setIsLoading, showErrModal]);

  async function refetchView() {
    fetchView();
  }

  useEffect(() => {
    fetchView();
  }, [fetchView]);

  return (
    <div className='vLanding'>
      <ErrModal />
      <GroupContextMenue
        cat={cat}
        catId={catId}
        catName={catName}
        songs={viewSongs}
        ref={groupContextMenueRef}
        addToPlayList={addToPlayList}
        handleGroupContextMenueEvents={handleGroupContextMenueEvents}
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
      {cat !== 'playlist' && cat !== 'favorites' ? (
        <InfoCard
          cat={cat}
          viewSongsDisplay={viewSongs}
          viewAlbumsDisplay={viewAlbums}
          handleListCardClick={handleListCardClick}
        />
      ) : (
        ''
      )}
      <div className='vLanding__songs'>
        <div className='vLanding__songs__control'>
          <div data-img data-imgname='repeat' style={{ opacity: 0.1 }} />
          <div
            data-img
            data-imgname='sort'
            onClick={() => {
              filterList('view', undefined);
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
            next={fetchView}
            dataLength={viewSongs.length}
            className={'aLanding__list--scroller'}
            loader={
              <div className='infinite__scroll__loader' key={0}>
                <div data-img data-imgname='loading' />
              </div>
            }
          >
            {viewSongs.map((s, k) => (
              <LazyLoad key={k} placeholder={<div>***</div>}>
                <SongItem
                  cat={cat}
                  catId={catId}
                  id={s._id}
                  url={s.url}
                  name={s.name}
                  queueId={s.queueId}
                  album={s.album ? s.album.name : null}
                  cover={s.album ? s.album.cover : null}
                  showSongModal={showSongModal}
                  handleSetSongQueues={handleSetSongQueues}
                  artist={
                    s.artist ? s.artist.map((a) => a.name).join(' / ') : null
                  }
                />
              </LazyLoad>
            ))}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};
export default withRouterAndRef(ViewLanding);
