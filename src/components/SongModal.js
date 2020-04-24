import React from 'react';
import { forwardRef } from 'react';
import './SongModal.css';
import { useRef } from 'react';
import colorLog from '../helpers/colorLog';
import { useSnackbar } from 'notistack';
import config from 'environment';
import { useState } from 'react';
import { useEffect } from 'react';

const SongModal = forwardRef(
  (
    {
      data,
      removeFromPlayList,
      showSongInfoModal,
      addToPlayList,
      handleSetSongQueues,
      syncLikes
    },
    ref
  ) => {
    const { enqueueSnackbar } = useSnackbar();
    const [likeBtn, setLikeBtn] = useState({ val: false });

    const handleCloseSongModal = () => {
      ref.current.classList.toggle('hide');
    };
    const handleLikeClick = ({ target }) => {
      const state = target.getAttribute('data-imgname');
      if (state === 'like') {
        target.setAttribute('data-imgname', 'like_fill');
        let likes = localStorage.getItem(`${config.appName}_LIKES`);
        if (likes && likes !== 'undefined') {
          likes = JSON.parse(likes);
          let isSongInList = false;
          for (const s in likes) {
            if (
              data.name === likes[s].name &&
              data.album === likes[s].album &&
              data.artist === likes[s].artist
            ) {
              isSongInList = true;
              // Song is already in likes
            }
          }
          if (!isSongInList) {
            delete data.cat;
            delete data.catId;
            delete data.queueId;
            likes.push(data);
            localStorage.setItem(
              `${config.appName}_LIKES`,
              JSON.stringify(likes)
            );
          }
        } else {
          localStorage.setItem(
            `${config.appName}_LIKES`,
            JSON.stringify([data])
          );
        }
      } else {
        target.setAttribute('data-imgname', 'like');
        let likes = localStorage.getItem(`${config.appName}_LIKES`);
        if (likes && likes !== 'undefined') {
          likes = JSON.parse(likes);
          const arr = [];
          for (const s in likes) {
            if (
              likes[s].name === data.name &&
              likes[s].artist === data.artist &&
              likes[s].album === data.album
            ) {
              // Do nothing if found in likes
            } else {
              arr.push(likes[s]);
            }
          }
          localStorage.setItem(`${config.appName}_LIKES`, JSON.stringify(arr));
        }
      }

      syncLikes();
    };

    useEffect(() => {
      let likes = localStorage.getItem(`${config.appName}_LIKES`);
      if (likes && likes !== 'undefined') {
        likes = JSON.parse(likes);
        let isFound = false;
        for (const s in likes) {
          if (
            likes[s].name === data.name &&
            likes[s].artist === data.artist &&
            likes[s].album === data.album
          ) {
            isFound = true;
          }
        }
        if (isFound) {
          setLikeBtn({ val: true });
        } else {
          setLikeBtn({ val: false });
        }
      }
    }, [data.album, data.artist, data.name]);
    return (
      <div className='modal hide' ref={ref}>
        <div className='modal__wrapper ' onClick={handleCloseSongModal}></div>
        <div className='modal__card'>
          <div className='modal__card__main'>
            <div className='modal__card__main__head'>
              <div className='modal__card__main__head__text truncate'>
                {data.name}
              </div>
              {data.cat !== 'nowplaying' ? (
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
                  showSongInfoModal(data);
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
              {data.cat === 'queues' ? (
                <div
                  className='modal__card__main__content__item'
                  onClick={() => {
                    handleCloseSongModal();
                    handleSetSongQueues('remove', data.queueId);
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
              {data.cat !== 'queues' ? (
                <div
                  className='modal__card__main__content__item'
                  onClick={() => {
                    ref.current.classList.add('hide');
                    handleSetSongQueues('add', data);
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
                  ref.current.classList.add('hide');
                  addToPlayList(undefined, undefined, data, 'single');
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
              {data.cat === 'playlist' ? (
                <div
                  className='modal__card__main__content__item'
                  onClick={() => {
                    ref.current.classList.add('hide');
                    removeFromPlayList(data.catId, data);
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
                  const link = `${window.location.host}/#/play/p?artist=${data.artist}&song=${data.name}`;
                  if (navigator.share) {
                    navigator
                      .share({
                        url: link,
                        title: 'Muse',
                        text: 'Check out Muse.'
                      })
                      .then(() => colorLog('Successful share', 'success'))
                      .catch(error => colorLog('Error sharing', 'error'));
                  } else if (navigator.clipboard) {
                    navigator.clipboard.writeText(link).then(
                      () => {
                        enqueueSnackbar('Copied link to clipboard');
                      },
                      err => {
                        console.log(err);
                        enqueueSnackbar('Could not share');
                      }
                    );
                  }
                  ref.current.classList.add('hide');
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
);
export default SongModal;
