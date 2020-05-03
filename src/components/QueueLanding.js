import './QueueLanding.css';
import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useContext
} from 'react';
import SongItem from './SongItem';
import config from 'environment';
import useQueue from './hooks/useQueue';
import AppContext from './hooks/AppContext';
import useSongModal from './hooks/useSongModal';
import useFilterModal from './hooks/useFilterModal';
import useAddToPlaylist from './hooks/useAddToPlaylist';
// eslint-disable-next-line no-empty-pattern
const QueueLanding = forwardRef(({}, ref) => {
  const queueModal = useRef(null);
  const { deleteQueue } = useQueue();
  const { queuePlayBtnRef, playerRef } = ref;
  const [SongModal, showSongModal] = useSongModal();
  const [appData, setAppData] = useContext(AppContext);
  const [queueDisplay, setQueueDisplay] = useState([]);
  const [FilterModal, setFilterModal] = useFilterModal();
  const [museViewQueue, setMuseViewQueue] = useState({ val: '' });
  const [displayedCount, setDisplayedCount] = useState({ val: 1 });
  const [AddToPlayListModal, setAddToPlaylist] = useAddToPlaylist();
  const [displayedTitle, setDisplayedTitle] = useState({ val: 'Queue' });

  const appDataCache = useRef(appData);

  useEffect(() => {
    setDisplayedCount({ val: '-- ' });
    queueDisplay.forEach((s, i) => {
      if (s._id === appData.playing._id) {
        setDisplayedCount({ val: i + 1 });
      }
    });
  }, [appData.playing._id, queueDisplay]);

  useEffect(() => {
    setDisplayedCount({
      val: appDataCache.current.playing.queueId
        ? appDataCache.current.playing.queueId + 1
        : 1
    });
    const vQueue = JSON.parse(
      localStorage.getItem(`${config.appName}_VIEWING_QUEUE`)
    );
    if (vQueue) {
      setMuseViewQueue({ val: vQueue });

      if (vQueue === 'Queues') {
        setAppData({
          ...appDataCache.current,
          playingQueue: appDataCache.current.queue
        });
        setQueueDisplay(appDataCache.current.queue);
      } else {
        if (appDataCache.current.playlist.length) {
          for (const p in appDataCache.current.playlist) {
            if (appDataCache.current.playlist[p]._id === vQueue) {
              const songs = appDataCache.current.playlist[p].songs.map(
                (p, i) => {
                  return { ...p, queueId: i };
                }
              );
              setDisplayedCount({ val: '-- ' });
              setQueueDisplay(songs);
              setAppData({ ...appDataCache.current, playingQueue: songs });

              setDisplayedTitle({ val: appDataCache.current.playlist[p].name });
            }
          }
        }
      }
    } else {
      setQueueDisplay(appDataCache.current.queue);
      setDisplayedTitle({ val: 'Queues' });
      setAppData({
        ...appDataCache.current,
        playingQueue: appDataCache.current.queue
      });
      localStorage.setItem(
        `${config.appName}_VIEWING_QUEUE`,
        JSON.stringify('Queues')
      );
      localStorage.setItem(
        `${config.appName}_PLAYING_QUEUES`,
        JSON.stringify(appDataCache.current.queue)
      );
      setMuseViewQueue({ val: 'Queues' });
    }
  }, [setAppData]);
  return (
    <div className='qLanding'>
      <SongModal />
      <FilterModal />
      <AddToPlayListModal />
      <div className='qLanding__ctrl'>
        <div className='qLanding__ctrl__top'>
          <div
            className='qLanding__ctrl__top__catSelect noselect'
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
                setQueueDisplay([]);
                deleteQueue(appData);
                setAppData({ ...appData, playingQueue: [] });
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
                setFilterModal(queueDisplay, setQueueDisplay);
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
                setAddToPlaylist(queueDisplay, 'multiple');
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
                setQueueDisplay(appData.queue);
                setDisplayedTitle({ val: 'Queues' });
                setAppData({ ...appData, playingQueue: appData.queue });

                localStorage.setItem(
                  `${config.appName}_VIEWING_QUEUE`,
                  JSON.stringify('Queues')
                );
                localStorage.setItem(
                  `${config.appName}_PLAYING_QUEUES`,
                  JSON.stringify(appData.queue)
                );
                setMuseViewQueue({ val: 'Queues' });
                queueModal.current.classList.add('hide');
              }}
            >
              #. Queues
            </div>
            <div className='qLanding__modal__card__body__title'>Playlists</div>
            {appData.playlist.map((p, k) => (
              <div
                key={k}
                className='qLanding__modal__card__body__item'
                onClick={() => {
                  const songs = p.songs.map((p, i) => {
                    delete p.cat;
                    delete p.catId;
                    delete p.catName;
                    return { ...p, queueId: i };
                  });

                  setQueueDisplay(songs);
                  setDisplayedTitle({ val: p.name });
                  setAppData({ ...appData, playingQueue: songs });
                  localStorage.setItem(
                    `${config.appName}_VIEWING_QUEUE`,
                    JSON.stringify(p._id)
                  );
                  localStorage.setItem(
                    `${config.appName}_PLAYING_QUEUES`,
                    JSON.stringify(songs)
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
            s._id === appData.playing._id &&
            s.queueId === appData.playing.queueId
          ) {
            return (
              <SongItem
                s={s}
                key={k}
                cat={'queues'}
                isPlaying={true}
                showSongModal={showSongModal}
              />
            );
          } else {
            return (
              <SongItem
                s={s}
                key={k}
                cat={'queues'}
                isPlaying={false}
                showSongModal={showSongModal}
              />
            );
          }
        })}
      </div>
    </div>
  );
});
export default QueueLanding;
