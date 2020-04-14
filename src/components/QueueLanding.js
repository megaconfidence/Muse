import './QueueLanding.css';
import React, { useRef, useState, useEffect } from 'react';
import SongItem from './SongItem';
import SongModal from './SongModal';
import config from 'environment';
import { useCallback } from 'react';
const QueueLanding = ({
  songQueues,
  playList,
  playerRef,
  playing,
  savePlayingSongQueues,
  handleSetSongQueues
}) => {
  const [displayedSongs, setDisplayedSongs] = useState({ val: [] });
  const songModalRef = useRef(null);
  const queueModal = useRef(null);
  const queueModalSort = useRef(null);
  const queueModalSave = useRef(null);
  const queueModalQueues = useRef(null);
  const [displayedTitle, setDisplayedTitle] = useState({ val: 'Queue' });
  const [displayedCount, setDisplayedCount] = useState({ val: 1 });
  const [songModalData, setSongModalData] = useState({ val: {} });

  const handleSortClick = () => {
    queueModal.current.classList.remove('hide');
    queueModalSort.current.classList.remove('hide');
    queueModalSave.current.classList.add('hide');
    queueModalQueues.current.classList.add('hide');
  };
  const handleListClick = () => {
    queueModal.current.classList.remove('hide');
    queueModalSort.current.classList.add('hide');
    queueModalSave.current.classList.add('hide');
    queueModalQueues.current.classList.remove('hide');
  };
  const handleSaveClick = () => {
    queueModal.current.classList.remove('hide');
    queueModalSort.current.classList.add('hide');
    queueModalSave.current.classList.remove('hide');
    queueModalQueues.current.classList.add('hide');
  };

  const handleSetSongModalData = data => {
    setSongModalData({ val: data });
  };

  const updateCount = useCallback(
    k => {
      displayedSongs.val.forEach((s, i) => {
        if (
          s.name === playing.name &&
          s.artist === playing.artist &&
          s.album === playing.album &&
          s.queueId === playing.queueId
        ) {
          setDisplayedCount({ val: i + 1 });
        }
      });
    },
    [
      displayedSongs.val,
      playing.album,
      playing.artist,
      playing.name,
      playing.queueId
    ]
  );

  useEffect(() => {
    // setDisplayedSongs({ val: songQueues });
    // savePlayingSongQueues(songQueues);
    setDisplayedCount({ val: playing.queueId ? playing.queueId + 1 : 1 });
    let vQueue = localStorage.getItem(`${config.appName}_VIEWING_QUEUE`);
    if (vQueue && vQueue !== 'undefined') {
      vQueue = JSON.parse(vQueue);

      if (vQueue === 'Queues') {
        setDisplayedSongs({ val: songQueues });
        savePlayingSongQueues(songQueues);
      } else {
        for (const p in playList) {
          if (playList[p]._id === vQueue) {
            const songs = playList[p].songs.map((p, i) => {
              return { ...p, queueId: i };
            });
            savePlayingSongQueues(songs);
            setDisplayedSongs({ val: songs });
            setDisplayedTitle({ val: playList[p].name });
          }
        }
      }
    }
  }, [playList, playing.queueId, savePlayingSongQueues, songQueues]);
  return (
    <div className='qLanding'>
      <div className='qLanding__ctrl'>
        <div className='qLanding__ctrl__top'>
          <div
            className='qLanding__ctrl__top__catSelect'
            onClick={handleListClick}
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
              className='qLanding__ctrl__top__cancel__img'
            />
          </div>
        </div>
        <div className='qLanding__ctrl__btm'>
          <div className='qLanding__ctrl__btm__lft'>
            <div
              data-img
              data-imgname='play'
              onClick={({ target }) => {
                const state = target.getAttribute('data-imgname');
                console.log(state)
                if (state === 'play') {
                  playerRef.current.audio.current.play();
                  target.setAttribute('data-imgname', 'pause');
                } else {
                  playerRef.current.audio.current.pause();
                  target.setAttribute('data-imgname', 'play');
                }
              }}
            />
            <div data-img data-imgname='sort' onClick={handleSortClick} />
          </div>
          <div className='qLanding__ctrl__btm__ctr'>
            <span className='qLanding__ctrl__btm__ctr__main'>
              {displayedCount.val}
            </span>
            /{displayedSongs.val.length}
          </div>
          <div className='qLanding__ctrl__btm__rgh'>
            <div data-img data-imgname='save' onClick={handleSaveClick} />
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
          <div className='hide' ref={queueModalSort}>
            <div className='qLanding__modal__card__head'>
              <div
                data-img
                data-imgname='sort'
                className='qLanding__modal__card__head__icon'
              />
              <div className='qLanding__modal__card__head__text'>
                Sort songs in selected queue
              </div>
            </div>
            <div className='qLanding__modal__card__body'>
              <div className='qLanding__modal__card__body__item'>Randomize</div>
              <div className='qLanding__modal__card__body__item'>Reverse</div>
              <div className='qLanding__modal__card__body__item'>
                Title - ascending
              </div>
              <div className='qLanding__modal__card__body__item'>
                Tigle -desending
              </div>
            </div>
          </div>
          <div className='hide' ref={queueModalQueues}>
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
                  setDisplayedSongs({ val: songQueues });
                  savePlayingSongQueues(songQueues);
                  setDisplayedTitle({ val: 'Queues' });
                  updateCount();
                  localStorage.setItem(
                    `${config.appName}_VIEWING_QUEUE`,
                    JSON.stringify('Queues')
                  );
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
                    savePlayingSongQueues(songs);
                    setDisplayedSongs({ val: songs });
                    setDisplayedTitle({ val: p.name });
                    updateCount();
                    localStorage.setItem(
                      `${config.appName}_VIEWING_QUEUE`,
                      JSON.stringify(p._id)
                    );

                    queueModal.current.classList.add('hide');
                  }}
                >
                  {k + 1}. {p.name}
                </div>
              ))}
            </div>
          </div>
          <div className='hide' ref={queueModalSave}>
            <div className='qLanding__modal__card__head'>
              <div className='qLanding__modal__card__head__text'>
                Save to a playlist
              </div>
            </div>
            <div className='qLanding__modal__card__body'>
              <div className='qLanding__modal__card__body__item'>
                + New Playlist
              </div>
              <div className='qLanding__modal__card__body__item'>1. Happy</div>
              <div className='qLanding__modal__card__body__item'>2. Sad</div>
            </div>
          </div>
        </div>
      </div>
      <SongModal
        cat='queues'
        ref={songModalRef}
        songModalData={songModalData.val}
        handleSetSongQueues={handleSetSongQueues}
      />
      <div className='qLanding__songlist'>
        {displayedSongs.val.map((s, k) => {
          if (
            s.name === playing.name &&
            s.artist === playing.artist &&
            s.album === playing.album &&
            s.queueId === playing.queueId
          ) {
            return (
              <SongItem
                //   cat={cat}
                isPlaying={true}
                key={k}
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
            );
          } else {
            return (
              <SongItem
                //   cat={cat}
                isPlaying={false}
                key={k}
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
            );
          }
        })}
      </div>
    </div>
  );
};
export default QueueLanding;
