import React from 'react';
import { forwardRef } from 'react';
import './SongModal.css'

const SongModal = forwardRef(
  ({ cat, songModalData, handleSetSongQueues }, ref) => {
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
                    Remove from playlist
                  </div>
                </div>
              ) : (
                ''
              )}
              {cat !== 'queues' ? (
                <div
                  className='modal__card__main__content__item'
                  onClick={() => {
                    handleSetSongQueues('add', songModalData);
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
              <div className='modal__card__main__content__item'>
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
