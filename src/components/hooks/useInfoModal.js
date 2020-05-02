import React from 'react';
import './useInfoModal.css';
import { useState } from 'react';

const useInfoModal = (data) => {
  const [song, setSong] = useState({ album: { genre: [] }, artist: [] });
  const [showModal, setShowModal] = useState(false);
  const Modal = () => {
    if (showModal) {
      return (
        <div className='siModal'>
          <div
            className='siModal__wrapper '
            onClick={() => {
              setShowModal(!showModal);
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
                  {song.name || '<unknown>'}
                </div>
              </div>
              <div className='siModal__card__body__item'>
                {' '}
                <div className='siModal__card__body__item__title'>Album</div>
                <div className='siModal__card__body__item__value truncate'>
                  {song.album.name || '<unknown>'}
                </div>
              </div>
              <div className='siModal__card__body__item'>
                {' '}
                <div className='siModal__card__body__item__title'>Artist</div>
                <div className='siModal__card__body__item__value truncate'>
                  {song.artist.map((a) => a.name).join(' / ') || '<unknown>'}
                </div>
              </div>
              <div className='siModal__card__body__item'>
                {' '}
                <div className='siModal__card__body__item__title'>Genre</div>
                <div className='siModal__card__body__item__value truncate'>
                  {song.album.genre.map((g) => g.name).join(' / ') ||
                    '<unknown>'}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return [setSong, setShowModal, Modal];
};

export default useInfoModal;
