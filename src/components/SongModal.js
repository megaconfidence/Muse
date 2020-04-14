import React from 'react';
import { forwardRef } from 'react';
import './SongModal.css';
import { useRef } from 'react';
import colorLog from '../helpers/colorLog';
import { useSnackbar } from 'notistack';

const SongModal = forwardRef(
  (
    {
      cat,
      catId,
      songModalData,
      removeFromPlayList,
      addToPlayList,
      handleSetSongQueues
    },
    ref
  ) => {
    const { enqueueSnackbar } = useSnackbar();

    const handleCloseSongModal = () => {
      ref.current.classList.toggle('hide');
    };
    return (
      <div className='modal hide' ref={ref}>
        <div className='modal__wrapper ' onClick={handleCloseSongModal}></div>
        <div className='modal__card'>
          <div className='modal__card__main'>
            <div className='modal__card__main__head'>
              <div className='modal__card__main__head__text truncate'>
                {songModalData.name}
              </div>
              <div
                data-img
                data-imgname='like'
                className='modal__card__main__head__icon'
              />
            </div>
            <div className='modal__card__main__content'>
              <div className='modal__card__main__content__item'>
                <div
                  data-img
                  data-imgname='info'
                  className='modal__card__main__content__item__icon'
                />
                <div className='modal__card__main__content__item__text'>
                  Song info
                </div>
              </div>
              {cat === 'queues' ? (
                <div
                  className='modal__card__main__content__item'
                  onClick={() => {
                    handleCloseSongModal();
                    handleSetSongQueues('remove', songModalData.queueId);
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
              {cat !== 'queues' ? (
                <div
                  className='modal__card__main__content__item'
                  onClick={() => {
                    ref.current.classList.add('hide');
                    handleSetSongQueues('add', songModalData);
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
                  addToPlayList(undefined, undefined, songModalData, 'single');
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
              {cat === 'playlist' ? (
                <div
                  className='modal__card__main__content__item'
                  onClick={() => {
                    ref.current.classList.add('hide');
                    removeFromPlayList(catId, songModalData);
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
                  const link = `${window.location.host}/#/play/p?artist=${songModalData.artist}&song=${songModalData.name}`;
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
