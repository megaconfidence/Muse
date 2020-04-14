import './GroupContextMenue.css';
import React from 'react';
import { forwardRef } from 'react';
import colorLog from '../helpers/colorLog';
import { useSnackbar } from 'notistack';

const GroupContextMenue = forwardRef(
  (
    {
      cat,
      handleGroupContextMenueEvents,
      addToPlayList,
      songs,
      catId,
      catName
    },
    ref
  ) => {
    const { enqueueSnackbar } = useSnackbar();

    return (
      <div className='gcMenue hide' ref={ref}>
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
                    ref.current.classList.add('hide');
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
                  ref.current.classList.add('hide');
                  addToPlayList(undefined, undefined, songs, 'multiple');
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
