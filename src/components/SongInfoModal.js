import React, { forwardRef } from 'react';
import './SongInfoModal.css';

const SongInfoModal = forwardRef(({ data }, ref) => {
  return (
    <div className='siModal hide ' ref={ref}>
      <div
        className='siModal__wrapper '
        onClick={() => {
          ref.current.classList.toggle('hide');
        }}
      ></div>

      <div className='siModal__card'>
        <div className='siModal__card__head'>
          <div
            data-img
            data-imgname='info'
            className='siModal__card__head__icon'
          />
          <div className='siModal__card__head__text'>Song info</div>
        </div>
        <div className='siModal__card__body'>
          <div className='siModal__card__body__item'>
            {' '}
            <div className='siModal__card__body__item__title'>Title</div>
            <div className='siModal__card__body__item__value truncate'>
              {data.name || '<unknown>'}
            </div>
          </div>
          <div className='siModal__card__body__item'>
            {' '}
            <div className='siModal__card__body__item__title'>Album</div>
            <div className='siModal__card__body__item__value truncate'>
              {data.album || '<unknown>'}
            </div>
          </div>
          <div className='siModal__card__body__item'>
            {' '}
            <div className='siModal__card__body__item__title'>Artist</div>
            <div className='siModal__card__body__item__value truncate'>
              {data.artist || '<unknown>'}
            </div>
          </div>
          <div className='siModal__card__body__item'>
            {' '}
            <div className='siModal__card__body__item__title'>Genre</div>
            <div className='siModal__card__body__item__value truncate'>
              {data.genre || '<unknown>'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default SongInfoModal;
