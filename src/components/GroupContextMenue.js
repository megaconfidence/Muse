import './GroupContextMenue.css';
import React, { useCallback } from 'react';
import { forwardRef } from 'react';
import colorLog from '../helpers/colorLog';
import { useSnackbar } from 'notistack';
import useAddToPlaylist from './hooks/useAddToPlaylist';
import config from 'environment';
import { useContext } from 'react';
import AppContext from './hooks/AppContext';
import useRenamePlaylist from './hooks/useRenamePlaylist';
import request from '../helpers'

const GroupContextMenue = forwardRef(
  ({ cat, songs, catId, catName, history }, ref) => {
    const { enqueueSnackbar } = useSnackbar();
    const [appData, setAppData] = useContext(AppContext);
    const [AddToPlayListModal, setAddToPlaylist] = useAddToPlaylist();
    const [RenamePLModal, setRenamePLModal] = useRenamePlaylist(history);

    const syncDeletedPlayList = useCallback(async () => {
      try {
        let dList = localStorage.getItem(`${config.appName}_PLAYLIST_DELETE`);

        if (dList && dList !== 'undefined') {
          dList = JSON.parse(dList);
          for (const d in dList) {
            await request('delete', `api/playlist/${dList[d]}`);
          }
          localStorage.removeItem(`${config.appName}_PLAYLIST_DELETE`);
        }
      } catch (err) {
        console.log(err);
      }
    }, []);

    const deletePlayList = useCallback(
      (id) => {
        if (id) {
          let pList = localStorage.getItem(`${config.appName}_PLAYLIST`);
          if (pList && pList !== 'undefined') {
            pList = JSON.parse(pList);
            for (const p in pList) {
              if (pList[p]._id === id) {
                pList.splice(p, 1);

                localStorage.setItem(
                  `${config.appName}_PLAYLIST`,
                  JSON.stringify(pList)
                );
                setAppData({ ...appData, playlist: pList });

                const dList = JSON.parse(
                  localStorage.getItem(`${config.appName}_PLAYLIST_DELETE`)
                );

                if (dList) {
                  dList.push(id);
                  localStorage.setItem(
                    `${config.appName}_PLAYLIST_DELETE`,
                    JSON.stringify(dList)
                  );
                } else {
                  localStorage.setItem(
                    `${config.appName}_PLAYLIST_DELETE`,
                    JSON.stringify([id])
                  );
                }

                history.push('/playlists');
                enqueueSnackbar('Playlist deleted');
                syncDeletedPlayList();
              }
            }
          }
        }
      },
      [appData, enqueueSnackbar, history, setAppData, syncDeletedPlayList]
    );

    const handleGroupContextMenueEvents = useCallback(
      (action, data) => {
        if (action === 'play') {
          const arr = [];
          for (const s in data) {
            delete data[s].cat;
            delete data[s].catId;
            delete data[s].catName;
            data[s].queueId = s;
            arr.push(data[s]);
          }
          setAppData({ ...appData, queue: arr });
          localStorage.setItem(`${config.appName}_QUEUES`, JSON.stringify(arr));
        } else if (action === 'queue') {
          const arr = appData.queue;
          const l = arr.length;
          for (const s in data) {
            delete data[s].cat;
            delete data[s].catId;
            delete data[s].catName;
            data[s].queueId = l + Number(s);
            arr.push(data[s]);
          }
          setAppData({ ...appData, queue: arr });

          localStorage.setItem(`${config.appName}_QUEUES`, JSON.stringify(arr));
        } else if (action === 'rename') {
          setRenamePLModal(data.id);
        } else if (action === 'delete') {
          deletePlayList(data.id);
        }
      },
      [appData, deletePlayList, setAppData, setRenamePLModal]
    );

    return (
      <div className='gcMenue hide' ref={ref}>
        <AddToPlayListModal />
        <RenamePLModal />
        <div
          className='gcMenue__wrapper '
          onClick={() => {
            ref.current.classList.toggle('hide');
          }}
        ></div>
        <div className='gcMenue__card'>
          <div className='gcMenue__card__main'>
            <div className='gcMenue__card__main__head'>
              <div className='gcMenue__card__main__head__text truncate'>
                {catName}
              </div>
            </div>
            <div className='gcMenue__card__main__content'>
              <div
                className='gcMenue__card__main__content__item'
                onClick={() => {
                  ref.current.classList.add('hide');
                  handleGroupContextMenueEvents('play', songs);
                }}
              >
                <div
                  data-img
                  data-imgname='play'
                  className='gcMenue__card__main__content__item__icon'
                />
                <div className='gcMenue__card__main__content__item__text'>
                  Play
                </div>
              </div>
              {cat === 'playlist' ? (
                <div
                  className='gcMenue__card__main__content__item'
                  onClick={() => {
                    handleGroupContextMenueEvents('rename', {
                      id: catId
                    });
                  }}
                >
                  <div
                    data-img
                    data-imgname='edit'
                    className='gcMenue__card__main__content__item__icon'
                  />
                  <div className='gcMenue__card__main__content__item__text'>
                    Rename playlist
                  </div>
                </div>
              ) : (
                ''
              )}
              {cat === 'playlist' ? (
                <div
                  className='gcMenue__card__main__content__item'
                  onClick={() => {
                    ref.current.classList.add('hide');
                    handleGroupContextMenueEvents('delete', {
                      id: catId
                    });
                  }}
                >
                  <div
                    data-img
                    data-imgname='remove'
                    className='gcMenue__card__main__content__item__icon'
                  />
                  <div className='gcMenue__card__main__content__item__text'>
                    Delete playlist
                  </div>
                </div>
              ) : (
                ''
              )}
              <div
                className='gcMenue__card__main__content__item'
                onClick={() => {
                  ref.current.classList.add('hide');
                  handleGroupContextMenueEvents('queue', songs);
                }}
              >
                <div
                  data-img
                  data-imgname='queue'
                  className='gcMenue__card__main__content__item__icon'
                />
                <div className='gcMenue__card__main__content__item__text'>
                  Add songs to queue
                </div>
              </div>{' '}
              <div
                className='gcMenue__card__main__content__item'
                onClick={() => {
                  // ref.current.classList.add('hide');
                  setAddToPlaylist(songs, 'multiple');
                }}
              >
                <div
                  data-img
                  data-imgname='add_playlist'
                  className='gcMenue__card__main__content__item__icon'
                />
                <div className='gcMenue__card__main__content__item__text'>
                  Add songs to playlist
                </div>
              </div>
              <div
                className='gcMenue__card__main__content__item'
                onClick={() => {
                  const link = window.location.href;
                  if (navigator.share) {
                    navigator
                      .share({
                        url: link,
                        title: 'Muse',
                        text: 'Check out Muse.'
                      })
                      .then(() => colorLog('Successful share', 'success'))
                      .catch((error) => colorLog('Error sharing', 'error'));
                  } else if (navigator.clipboard) {
                    navigator.clipboard.writeText(link).then(
                      () => {
                        enqueueSnackbar('Copied link to clipboard');
                      },
                      (err) => {
                        console.log(err);
                        enqueueSnackbar('Could not share');
                      }
                    );
                  } else {
                    enqueueSnackbar('Could not share');
                  }
                  ref.current.classList.add('hide');
                }}
              >
                <div
                  data-img
                  data-imgname='share'
                  className='gcMenue__card__main__content__item__icon'
                />
                <div className='gcMenue__card__main__content__item__text'>
                  Share
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default GroupContextMenue;
