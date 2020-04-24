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
import config from 'environment';
import LazyLoad from 'react-lazyload';
import { withRouter } from 'react-router-dom';
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

const ViewLanding = forwardRef(
  (
    {
      path,
      history,
      addToPlayList,
      setViewDisplay,
      filterList,
      showSongModal,
      viewSongsDisplay,
      viewAlbumsDisplay,
      updateViewSongsDisplay,
      handleSetSongQueues,
      handleGroupContextMenueEvents
    },
    ref
  ) => {
    path = path.split('/');
    const cat = path[0];
    const catName = path[1];
    const catId = path[2];
    const groupContextMenueRef = useRef(null);

    const { viewSongsDisplayFixed } = ref;

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
                updateViewSongsDisplay(viewSongsDisplayFixed.current);
              } else {
                /**
                 * Show songs containing card name
                 */
                const arr = [];
                viewSongsDisplay = viewSongsDisplayFixed.current;
                const cardName = e.textContent.toLowerCase();

                viewSongsDisplay.forEach(s => {
                  const re = /fe?a?t\.?\s/g;
                  s.name = s.name.replace(/[^a-zA-Z0-9 \-$]/g, '');
                  if (
                    re.test(s.name) &&
                    s.name.search(re) < s.name.lastIndexOf(cardName)
                  ) {
                    arr.push(s);
                  }
                });
                if (arr.length) {
                  updateViewSongsDisplay(arr);
                } else {
                  updateViewSongsDisplay(viewSongsDisplay);
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
                updateViewSongsDisplay(viewSongsDisplayFixed.current);
              } else {
                /**
                 * Show songs containing card name
                 */
                const arr = [];
                viewSongsDisplay = viewSongsDisplayFixed.current;
                const cardName = e.textContent.toLowerCase();

                viewSongsDisplay.forEach(s => {
                  // console.log(s)
                  if (s.album.includes(cardName)) {
                    arr.push(s);
                  }
                });

                setTimeout(() => {
                  if (arr.length) {
                    updateViewSongsDisplay(arr);
                  } else {
                    updateViewSongsDisplay(viewSongsDisplay);
                  }
                }, 100);
              }
            } else {
              e.classList.remove('vLanding__info__list__card--select');
            }
          });
      }
    };

    useEffect(() => {
      setViewDisplay(cat, catName, catId);
    }, [cat, catId, catName, setViewDisplay]);

    return (
      <div className='vLanding'>
        <GroupContextMenue
          cat={cat}
          catId={catId}
          catName={catName}
          songs={viewSongsDisplay}
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
            style={{opacity: 0.1}}
            className='vLanding__nav__icon'
          />
        </div>
        {cat !== 'playlist' && cat !== 'favorites' ? (
          <InfoCard
            cat={cat}
            viewSongsDisplay={viewSongsDisplay}
            viewAlbumsDisplay={viewAlbumsDisplay}
            handleListCardClick={handleListCardClick}
          />
        ) : (
          ''
        )}
        <div className='vLanding__songs'>
          <div className='vLanding__songs__control'>
            <div data-img data-imgname='repeat' style={{opacity: 0.1}}/>
            <div data-img data-imgname='sort' onClick={() => {
              filterList('view', undefined)
            }} />
            <div
              data-img
              data-imgname='menu_horizontal'
              onClick={() => {
                groupContextMenueRef.current.classList.remove('hide');
              }}
            />
          </div>

          <div className='vLanding__songs__list'>
            {viewSongsDisplay.map((s, k) => (
              <LazyLoad key={k} placeholder={<div>***</div>}>
                <SongItem
                  cat={cat}
                  catId={catId}
                  url={s.url}
                  name={s.name}
                  album={s.album}
                  cover={s.cover}
                  artist={s.artist}
                  queueId={s.queueId}
                  showSongModal={showSongModal}
                  handleSetSongQueues={handleSetSongQueues}
                />
              </LazyLoad>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

export default withRouterAndRef(ViewLanding);
