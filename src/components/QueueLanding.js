import './QueueLanding.css';
import React, { useRef, useState, useEffect, forwardRef } from 'react';
import SongItem from './SongItem';
import config from 'environment';
const QueueLanding = forwardRef(
  (
    {
      playing,
      playList,
      playerRef,
      filterList,
      songQueues,
      deleteQueue,
      queueDisplay,
      showSongModal,
      addToPlayList,
      updateQueueDisplay,
      handleSetSongQueues
    },
    ref
  ) => {
    const { queuePlayBtnRef } = ref;
    // const  queuePlayBtnRef  = useRef(null);
    const queueModal = useRef(null);
    const [museViewQueue, setMuseViewQueue] = useState({ val: '' });
    const [displayedTitle, setDisplayedTitle] = useState({ val: 'Queue' });
    const [displayedCount, setDisplayedCount] = useState({ val: 1 });

    useEffect(() => {
      setDisplayedCount({ val: '-- ' });
      queueDisplay.forEach((s, i) => {
        if (
          s.name === playing.name &&
          s.artist === playing.artist &&
          s.album === playing.album &&
          s.queueId === playing.queueId
        ) {
          setDisplayedCount({ val: i + 1 });
        }
      });
    }, [
      playing.album,
      playing.artist,
      playing.name,
      playing.queueId,
      queueDisplay
    ]);

    useEffect(() => {
      setDisplayedCount({ val: playing.queueId ? playing.queueId + 1 : 1 });
      let vQueue = localStorage.getItem(`${config.appName}_VIEWING_QUEUE`);
      if (vQueue && vQueue !== 'undefined') {
        vQueue = JSON.parse(vQueue);
        setMuseViewQueue({ val: vQueue });

        if (vQueue === 'Queues') {
          updateQueueDisplay(songQueues);
        } else {
          for (const p in playList) {
            if (playList[p]._id === vQueue) {
              const songs = playList[p].songs.map((p, i) => {
                return { ...p, queueId: i };
              });
              setDisplayedCount({ val: '-- ' });
              updateQueueDisplay(songs);
              setDisplayedTitle({ val: playList[p].name });
            }
          }
        }
      } else {
        setDisplayedTitle({ val: 'Queues' });
        updateQueueDisplay(songQueues);
        localStorage.setItem(
          `${config.appName}_VIEWING_QUEUE`,
          JSON.stringify('Queues')
        );
        setMuseViewQueue({ val: 'Queues' });
      }
    }, [playList, playing.queueId, songQueues, updateQueueDisplay]);
    return (
      <div className='qLanding'>
        <div className='qLanding__ctrl'>
          <div className='qLanding__ctrl__top'>
            <div
              className='qLanding__ctrl__top__catSelect'
              onClick={() => {
                queueModal.current.classList.remove('hide');
              }}
            >
              <div className='qLanding__ctrl__top__catSelect__name'>
                {displayedTitle.val}
              </div>
              <div
                data-img
                data-imgname='caret_down'
                className='qLanding__ctrl__top__catSelect__icon'
              />
            </div>
            <div className='qLanding__ctrl__top__cancel'>
              <div
                data-img
                data-imgname='close'
                style={{
                  opacity: museViewQueue.val === 'Queues' ? '1' : '0.5',
                  pointerEvents:
                    museViewQueue.val === 'Queues' ? 'initial' : 'none'
                }}
                onClick={() => {
                  deleteQueue();
                  updateQueueDisplay([]);
                }}
                className='qLanding__ctrl__top__cancel__img'
              />
            </div>
          </div>
          <div className='qLanding__ctrl__btm'>
            <div className='qLanding__ctrl__btm__lft'>
              <div
                data-img
                data-imgname='play'
                ref={queuePlayBtnRef}
                onClick={({ target }) => {
                  const state = target.getAttribute('data-imgname');
                  if (state === 'play') {
                    playerRef.current.audio.current.play();
                    target.setAttribute('data-imgname', 'pause');
                  } else {
                    playerRef.current.audio.current.pause();
                    target.setAttribute('data-imgname', 'play');
                  }
                }}
              />
              <div
                data-img
                data-imgname='sort'
                onClick={() => {
                  filterList('queue', undefined);
                }}
              />
            </div>
            <div className='qLanding__ctrl__btm__ctr'>
              <span className='qLanding__ctrl__btm__ctr__main'>
                {displayedCount.val}
              </span>
              /{queueDisplay.length}
            </div>
            <div className='qLanding__ctrl__btm__rgh'>
              <div
                data-img
                data-imgname='save'
                onClick={() => {
                  addToPlayList(undefined, undefined, queueDisplay, 'multiple');
                }}
              />
            </div>
          </div>
        </div>
        <div className='qLanding__modal hide' ref={queueModal}>
          <div
            className='qLanding__modal__wrapper '
            onClick={() => {
              queueModal.current.classList.toggle('hide');
            }}
          ></div>

          <div className='qLanding__modal__card'>
            <div className='qLanding__modal__card__head'>
              <div
                data-img
                data-imgname='queue'
                className='qLanding__modal__card__head__icon'
              />
              <div className='qLanding__modal__card__head__text'>Lists</div>
            </div>
            <div className='qLanding__modal__card__body'>
              <div
                className='qLanding__modal__card__body__item'
                onClick={() => {
                  updateQueueDisplay(songQueues);
                  setDisplayedTitle({ val: 'Queues' });
                  localStorage.setItem(
                    `${config.appName}_VIEWING_QUEUE`,
                    JSON.stringify('Queues')
                  );
                  setMuseViewQueue({ val: 'Queues' });
                  queueModal.current.classList.add('hide');
                }}
              >
                #. Queues
              </div>
              <div className='qLanding__modal__card__body__title'>
                Playlists
              </div>
              {playList.map((p, k) => (
                <div
                  key={k}
                  className='qLanding__modal__card__body__item'
                  onClick={() => {
                    const songs = p.songs.map((p, i) => {
                      return { ...p, queueId: i };
                    });
                    updateQueueDisplay(songs);
                    setDisplayedTitle({ val: p.name });
                    localStorage.setItem(
                      `${config.appName}_VIEWING_QUEUE`,
                      JSON.stringify(p._id)
                    );
                    setMuseViewQueue({ val: p._id });
                    queueModal.current.classList.add('hide');
                  }}
                >
                  {k + 1}. {p.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='qLanding__songlist'>
          {queueDisplay.map((s, k) => {
            if (
              s.name === playing.name &&
              s.artist === playing.artist &&
              s.album === playing.album &&
              s.queueId === playing.queueId
            ) {
              return (
                <SongItem
                  isPlaying={true}
                  key={k}
                  url={s.url}
                  name={s.name}
                  cat={'queues'}
                  album={s.album}
                  cover={s.cover}
                  artist={s.artist}
                  queueId={s.queueId}
                  showSongModal={showSongModal}
                  handleSetSongQueues={handleSetSongQueues}
                />
              );
            } else {
              return (
                <SongItem
                  isPlaying={false}
                  key={k}
                  id={s._id}
                  url={s.url}
                  name={s.name}
                  cat={'queues'}
                  album={s.album}
                  cover={s.cover}
                  artist={s.artist}
                  queueId={s.queueId}
                  showSongModal={showSongModal}
                  handleSetSongQueues={handleSetSongQueues}
                />
              );
            }
          })}
        </div>
      </div>
    );
  }
);
export default QueueLanding;
