import React from 'react';
import './AddToPlayList.css';
import { forwardRef } from 'react';

const AddToPlayList = forwardRef(
  ({ playList, addToPlayList, createPlayList, stagedSong }, ref) => {
    return (
      <div className='atPlayList__modal hide' ref={ref}>
        <div
          className='atPlayList__modal__wrapper '
          onClick={() => {
            ref.current.classList.toggle('hide');
          }}
        ></div>

        <div className='atPlayList__modal__card'>
          <div className='atPlayList__modal__card__head'>
            <div className='atPlayList__modal__card__head__text'>
              Select a playlist
            </div>
          </div>
          <div className='atPlayList__modal__card__body'></div>
          <div className='atPlayList__modal__card__body'>
            <div
              className='atPlayList__modal__card__body__item atPlayList__modal__card__body__item--new'
              onClick={() => {
                createPlayList()
              }}
            >
              + New Playlist
            </div>
            {playList.map((p, k) => (
              <div
                key={k}
                className='atPlayList__modal__card__body__item'
                onClick={() => {
                  addToPlayList(p._id, stagedSong, undefined);
                }}
              >
                {k + 1}. {p.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);
export default AddToPlayList;
