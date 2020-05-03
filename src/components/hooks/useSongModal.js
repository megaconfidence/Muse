import React, { useState, useEffect, useCallback } from 'react';
import './useSongModal.css';
import colorLog from '../../helpers/colorLog';
import { useSnackbar } from 'notistack';
import config from 'environment';
import useQueue from './useQueue';
import useInfoModal from './useInfoModal';
import useAddToPlaylist from './useAddToPlaylist';
import { useContext } from 'react';
import AppContext from './AppContext';
import request from '../../helpers';

const useSongModal = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { mutateQueue } = useQueue();
  const [setInfoModalData, shwoInfoModal, InfoModal] = useInfoModal();
  const [likeBtn, setLikeBtn] = useState({ val: false });
  const [AddToPlayListModal, setAddToPlaylist] = useAddToPlaylist();
  const [appData, setAppData] = useContext(AppContext);
  const [showModal, setShowModal] = useState(false);
  const [song, setSong] = useState({});

  const syncSavedPlayList = useCallback(async () => {
    try {
      let pList = localStorage.getItem(`${config.appName}_PLAYLIST`);

      const toLocal = async () => {
        try {
          const data = await request('get', 'api/playlist');
          const list = data.data.data;
          localStorage.setItem(
            `${config.appName}_PLAYLIST`,
            JSON.stringify(list)
          );
          setAppData({ ...appData, playlist: list });
        } catch (err) {
          console.log(err);
        }
      };
      if (pList && pList !== 'undefined') {
        pList = JSON.parse(pList);
        for (const p in pList) {
          if (pList[p]._id.includes('_')) {
            delete pList[p]._id;
            await request('post', 'api/playlist', pList[p]);
          } else {
            const id = pList[p]._id;
            delete pList[p]._id;
            await request('put', `api/playlist/${id}`, pList[p]);
          }
          if (Number(p) === pList.length - 1) {
            toLocal();
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, [appData, setAppData]);

  const saveToPlayList = useCallback(
    (list, i, update) => {
      list.splice(i, 1, update);
      localStorage.setItem(`${config.appName}_PLAYLIST`, JSON.stringify(list));
      setAppData({ ...appData, playlist: list });

      syncSavedPlayList();
    },
    [appData, setAppData, syncSavedPlayList]
  );

  const removeFromPlayList = useCallback(
    (id, song) => {
      if (id && song) {
        let pList = localStorage.getItem(`${config.appName}_PLAYLIST`);
        if (pList && pList !== 'undefined') {
          pList = JSON.parse(pList);

          for (const p in pList) {
            if (pList[p]._id === id) {
              // listName = pList[p].name;
              for (const s in pList[p].songs) {
                if (song._id === pList[p].songs[s]._id) {
                  pList[p].songs.splice(s, 1);
                }
              }

              saveToPlayList(pList, p, pList[p]);
              enqueueSnackbar('Song removed');
            }
          }
        }
      }
    },
    [enqueueSnackbar, saveToPlayList]
  );

  const syncLikes = useCallback(async () => {
    try {
      let id = localStorage.getItem(`${config.appName}_LIKESID`);
      let likes = localStorage.getItem(`${config.appName}_LIKES`);
      if (likes && likes !== 'undefined') {
        likes = JSON.parse(likes);
        if (id && id !== 'undefined') {
          id = JSON.parse(id);
          const data = await request('put', `api/like/${id}`, {
            songs: likes
          });
          const songs = data.data.data.songs;
          localStorage.setItem(
            `${config.appName}_LIKES`,
            JSON.stringify(songs)
          );
          setAppData({ ...appData, likes: songs });
        } else {
          const data = await request('post', 'api/like', {
            songs: likes
          });
          const songs = data.data.data.songs;
          localStorage.setItem(
            `${config.appName}_LIKESID`,
            JSON.stringify(data.data.data._id)
          );
          localStorage.setItem(
            `${config.appName}_LIKES`,
            JSON.stringify(songs)
          );
          setAppData({ ...appData, likes: songs });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, [appData, setAppData]);

  const handleLikeClick = ({ target }) => {
    const state = target.getAttribute('data-imgname');
    if (state === 'like') {
      target.setAttribute('data-imgname', 'like_fill');
      let likes = appData.likes;
      if (likes.length) {
        likes = JSON.parse(likes);
        let isSongInList = false;
        for (const s in likes) {
          if (song._id === likes[s]._id) {
            isSongInList = true;
            // Song is already in likes
          }
        }
        if (!isSongInList) {
          delete song.cat;
          delete song.catId;
          delete song.queueId;
          delete song.catName;
          likes.push(song);
          localStorage.setItem(
            `${config.appName}_LIKES`,
            JSON.stringify(likes)
          );
          setAppData({ ...appData, likes });
        }
      } else {
        localStorage.setItem(`${config.appName}_LIKES`, JSON.stringify([song]));
        setAppData({ ...appData, likes: [song] });
      }
    } else {
      target.setAttribute('data-imgname', 'like');
      let likes = localStorage.getItem(`${config.appName}_LIKES`);
      if (likes && likes !== 'undefined') {
        likes = JSON.parse(likes);
        const arr = [];
        for (const s in likes) {
          if (likes[s]._id !== song._id) {
            arr.push(likes[s]);
          }
        }
        localStorage.setItem(`${config.appName}_LIKES`, JSON.stringify(arr));
        setAppData({ ...appData, likes: arr });
      }
    }

    syncLikes();
  };


  useEffect(() => {
    let isFound = false;
    for (const s in appData.likes) {
      if (appData.likes[s]._id === song._id) {
        isFound = true;
      }
    }
    if (isFound) {
      setLikeBtn({ val: true });
    } else {
      setLikeBtn({ val: false });
    }
  }, [appData.likes, song._id]);

  const setUpHook = (song) => {
    setSong(song);
    setShowModal(true);
  };
  const Modal = () => {
    if (showModal) {
      return (
        <div className='modal'>
          <InfoModal />
          <AddToPlayListModal />
          <div
            className='modal__wrapper '
            onClick={() => {
              setShowModal(!showModal);
            }}
          ></div>
          <div className='modal__card'>
            <div className='modal__card__main'>
              <div className='modal__card__main__head'>
                <div className='modal__card__main__head__text truncate'>
                  {song.name}
                </div>
                {song.cat !== 'nowplaying' ? (
                  <div
                    data-img
                    data-imgname={likeBtn.val ? 'like_fill' : 'like'}
                    onClick={handleLikeClick}
                    className='modal__card__main__head__icon'
                  />
                ) : (
                  ''
                )}
              </div>
              <div className='modal__card__main__content'>
                <div
                  className='modal__card__main__content__item'
                  onClick={() => {
                    shwoInfoModal(true);
                    setInfoModalData(song);
                  }}
                >
                  <div
                    data-img
                    data-imgname='info'
                    className='modal__card__main__content__item__icon'
                  />
                  <div className='modal__card__main__content__item__text'>
                    Song info
                  </div>
                </div>
                {song.cat === 'queues' ? (
                  <div
                    className='modal__card__main__content__item'
                    onClick={() => {
                      setShowModal(!showModal);
                      mutateQueue('remove', song.queueId, {
                        ...appData,
                        playing: song
                      });
                    }}
                  >
                    <div
                      data-img
                      data-imgname='remove'
                      className='modal__card__main__content__item__icon'
                    />
                    <div className='modal__card__main__content__item__text'>
                      Remove from queue
                    </div>
                  </div>
                ) : (
                  ''
                )}
                {song.cat !== 'queues' ? (
                  <div
                    className='modal__card__main__content__item'
                    onClick={() => {
                      setShowModal(!showModal);
                      mutateQueue('add', song, { ...appData, playing: song });
                    }}
                  >
                    <div
                      data-img
                      data-imgname='queue'
                      className='modal__card__main__content__item__icon'
                    />
                    <div className='modal__card__main__content__item__text'>
                      Add to queue
                    </div>
                  </div>
                ) : (
                  ''
                )}
                <div
                  className='modal__card__main__content__item'
                  onClick={() => {
                    setAddToPlaylist(song, 'single');
                  }}
                >
                  <div
                    data-img
                    data-imgname='add_playlist'
                    className='modal__card__main__content__item__icon'
                  />
                  <div className='modal__card__main__content__item__text'>
                    Add to playlist
                  </div>
                </div>
                {song.cat === 'playlist' ? (
                  <div
                    className='modal__card__main__content__item'
                    onClick={() => {
                      setShowModal(!showModal);
                      removeFromPlayList(song.catId, song);
                    }}
                  >
                    <div
                      data-img
                      data-imgname='remove'
                      className='modal__card__main__content__item__icon'
                    />
                    <div className='modal__card__main__content__item__text'>
                      Remove from playlist
                    </div>
                  </div>
                ) : (
                  ''
                )}
                <div className='modal__card__main__content__item'>
                  <div
                    data-img
                    data-imgname='next'
                    className='modal__card__main__content__item__icon'
                  />
                  <div className='modal__card__main__content__item__text'>
                    Play after current song
                  </div>
                </div>
                <div
                  className='modal__card__main__content__item'
                  onClick={() => {
                    const link = `${window.location.host}/#/play/p?artist=${song.artist}&song=${song.name}`;
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
                    }
                    setShowModal(!showModal);
                  }}
                >
                  <div
                    data-img
                    data-imgname='share'
                    className='modal__card__main__content__item__icon'
                  />
                  <div className='modal__card__main__content__item__text'>
                    Share
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };
  return [Modal, setUpHook];
};
export default useSongModal;
