import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import './SongItem.css';

const SongItem = forwardRef(
  (
    {
      top,
      itemheight,
      cover,
      name,
      cat,
      album,
      artist,
      url,
      queueId,
      handleSetSongModalData,
      handleSetSongQueues
    },
    ref
  ) => {
    const songData = {
      url,
      name,
      album,
      cover,
      artist,
      queueId
    };

    const handleSongOptionClick = () => {
      ref.current.classList.toggle('hide');
      handleSetSongModalData(songData);
    };
    return (
      <div
        className='vLanding__songs__list__item'
        style={{ top: top, height: itemheight }}
      >
        <Link
          to={{
            data: songData,
            pathname: `/play/p`,
            search: `?artist=${artist}&song=${name}`
          }}
          onClick={() => {
            if (cat !== 'queues') {
              handleSetSongQueues('play', songData);
            }
          }}
        >
          <div
            className='vLanding__songs__list__item__img'
            style={{ backgroundImage: `url(${cover})` }}
          />
          <div className='vLanding__songs__list__item__text'>
            <div className='vLanding__songs__list__item__text__song truncate'>
              {name}
            </div>
            <div className='vLanding__songs__list__item__text__artist truncate'>
              {cat === 'artist' ? album : artist}
            </div>
          </div>
        </Link>
        <div
          data-img
          data-imgname='menu_horizontal'
          className='vLanding__songs__list__item__option'
          onClick={handleSongOptionClick}
        />
      </div>
    );
  }
);

export default SongItem;
