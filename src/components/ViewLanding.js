import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useCallback
} from 'react';
import _ from 'lodash';
import './ViewLanding.css';
import InfoCard from './InfoCard';
import SongItem from './SongItem';
import LazyLoad from 'react-lazyload';
import { withRouter } from 'react-router-dom';
import SongModal from './SongModal';
import GroupContextMenue from './GroupContextMenue';

const withRouterAndRef = Wrapped => {
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

function ViewLanding({
  path,
  removeFromPlayList,
  handleGroupContextMenueEvents,
  addToPlayList,
  playList,
  songs,
  history,
  handleSetSongQueues
}) {
  path = path.split('/');
  const cat = path[0];
  const catName = path[1];
  const catId = path[2];
  const songModalRef = useRef(null);
  const groupContextMenueRef = useRef(null);
  const allSongsFixed = useRef(null);
  const [allSongs, setAllSongs] = useState({ val: [] });
  const [allAlbums, setAllAlbums] = useState({ val: [] });
  const [songModalData, setSongModalData] = useState({ val: {} });

  const handleSetSongModalData = data => {
    setSongModalData({ val: data });
  };

  const handleListCardClick = i => {
    if (cat === 'album') {
      document
        .querySelectorAll('.vLanding__info__list__card')
        .forEach((e, k) => {
          if (k === i) {
            e.classList.add('vLanding__info__list__card--select');
            if (i === 0 || i === 1) {
              /**
               * Do nothing if first or second card is clicked
               */
              setAllSongs({ val: allSongsFixed.current });
            } else {
              /**
               * Show songs containing card name
               */
              const arr = [];
              allSongs.val = allSongsFixed.current;
              const cardName = e.textContent.toLowerCase();

              allSongs.val.forEach(s => {
                const re = /fe?a?t\.?\s/g;
                s.name = s.name.replace(/[^a-zA-Z0-9 \-$]/g, '');
                if (
                  re.test(s.name) &&
                  s.name.search(re) < s.name.lastIndexOf(cardName)
                ) {
                  arr.push(s);
                }
              });
              setAllSongs({ val: arr || allSongs.val });
            }
          } else {
            e.classList.remove('vLanding__info__list__card--select');
          }
        });
    } else if (cat === 'artist' || cat === 'genre') {
      document
        .querySelectorAll('.vLanding__info__list__card')
        .forEach((e, k) => {
          if (k === i) {
            e.classList.add('vLanding__info__list__card--select');
            if (i === 0) {
              /**
               * Do nothing if first card is clicked
               */
              setAllSongs({ val: allSongsFixed.current });
            } else {
              /**
               * Show songs containing card name
               */
              const arr = [];
              allSongs.val = allSongsFixed.current;
              const cardName = e.textContent.toLowerCase();

              allSongs.val.forEach(s => {
                // console.log(s)
                if (s.album.includes(cardName)) {
                  arr.push(s);
                }
              });
              setAllSongs({ val: arr || allSongs.val });
            }
          } else {
            e.classList.remove('vLanding__info__list__card--select');
          }
        });
    }
  };

  const getSongs = useCallback(() => {
    if (cat === 'album') {
      for (const a in songs) {
        for (const s in songs[a]) {
          if (songs[a][s].albumName === catName) {
            songs[a][s].albumSongs = songs[a][s].albumSongs.map(ss => ({
              url: ss.url,
              name: ss.name,
              cover: songs[a][s].albumArt,
              album: songs[a][s].albumName,
              artist: songs[a][s].albumArtist
            }));
            allSongsFixed.current = songs[a][s].albumSongs;
            setAllSongs({
              val: songs[a][s].albumSongs
            });

            /**
             * The below block generates card from song names containing feat or ft
             */
            const arr = [
              {
                albumArt: songs[a][s].albumArt,
                albumName: songs[a][s].albumArtist
              }
            ];

            songs[a][s].albumSongs.forEach(ss => {
              let { name } = ss;
              const re = /[^le]fe?a?t\.?\s/g;

              if (re.test(name)) {
                const typ = name.includes('feat') ? 'feat' : 'ft';
                name = name.split(typ)[1];
                const save = v => {
                  const obj = {
                    albumName: v.replace(/[^a-zA-Z0-9 \-$]/g, '').trim(),
                    albumArt: ss.cover
                  };

                  if (!_.find(arr, obj)) {
                    arr.push(obj);
                  }
                };

                name.split(/[&,]+/).forEach(n => {
                  save(n);
                });
              }
            });
            setAllAlbums({ val: arr });
            /**
             * End of card generation block
             */
          }
        }
      }
    } else if (cat === 'artist') {
      for (const ar in songs) {
        if (ar === catName) {
          setAllAlbums({ val: songs[ar] });
          const arr = [];
          for (const a in songs[ar]) {
            songs[ar][a].albumSongs.forEach(s => {
              arr.push({
                url: s.url,
                name: s.name,
                cover: songs[ar][a].albumArt,
                album: songs[ar][a].albumName,
                artist: songs[ar][a].albumArtist
              });
            });
          }
          allSongsFixed.current = arr;
          setAllSongs({ val: arr });
        }
      }
    } else if (cat === 'genre') {
      const songsArr = [];
      const albumsArr = [];
      for (const ar in songs) {
        for (const a in songs[ar]) {
          if (songs[ar][a].albumGenre === catName) {
            console.log(songs[ar][a]);
            albumsArr.push(songs[ar][a]);
            songs[ar][a].albumSongs.forEach(s => {
              songsArr.push({
                url: s.url,
                name: s.name,
                cover: songs[ar][a].albumArt,
                album: songs[ar][a].albumName,
                artist: songs[ar][a].albumArtist
              });
            });
          }
        }
      }
      allSongsFixed.current = songsArr;
      setAllAlbums({ val: albumsArr });
      setAllSongs({ val: songsArr });
    } else if (cat === 'playlist') {
      for (const p in playList) {
        if (playList[p]._id === catId) {
          const pListSongs = playList[p].songs;
          allSongsFixed.current = pListSongs;
          setAllSongs({
            val: pListSongs
          });
        }
      }
    }
  }, [cat, catId, catName, playList, songs]);

  useEffect(() => {
    getSongs();
  }, [getSongs]);

  return (
    <div className='vLanding'>
      <GroupContextMenue
        cat={cat}
        catId={catId}
        catName={catName}
        songs={allSongs.val}
        ref={groupContextMenueRef}
        addToPlayList={addToPlayList}
        handleGroupContextMenueEvents={handleGroupContextMenueEvents}
      />
      <SongModal
        catId={catId}
        cat={cat}
        ref={songModalRef}
        addToPlayList={addToPlayList}
        removeFromPlayList={removeFromPlayList}
        songModalData={songModalData.val}
        handleSetSongQueues={handleSetSongQueues}
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
        <div data-img data-imgname='settings' className='vLanding__nav__icon' />
      </div>
      {cat !== 'playlist' ? (
        <InfoCard
          cat={cat}
          allSongs={allSongs}
          allAlbums={allAlbums}
          handleListCardClick={handleListCardClick}
        />
      ) : (
        ''
      )}
      <div className='vLanding__songs'>
        <div className='vLanding__songs__control'>
          <div data-img data-imgname='repeat' />
          <div data-img data-imgname='sort' />
          <div
            data-img
            data-imgname='menu_horizontal'
            onClick={() => {
              groupContextMenueRef.current.classList.remove('hide');
            }}
          />
        </div>

        <div className='vLanding__songs__list'>
          {allSongs.val.map((s, k) => (
            <LazyLoad key={k} placeholder={<div>***</div>}>
              <SongItem
                cat={cat}
                url={s.url}
                name={s.name}
                album={s.album}
                cover={s.cover}
                artist={s.artist}
                queueId={s.queueId}
                ref={songModalRef}
                handleSetSongQueues={handleSetSongQueues}
                handleSetSongModalData={handleSetSongModalData}
              />
            </LazyLoad>
          ))}
        </div>
      </div>
    </div>
  );
}

export default withRouterAndRef(ViewLanding);
