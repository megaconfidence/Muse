import React from 'react';
import { Link } from 'react-router-dom';
import './SongItem.css';

const SongItem = ({
  url,
  cat,
  catId,
  name,
  album,
  cover,
  artist,
  queueId,
  isPlaying,
  showSongModal,
  handleSetSongQueues
}) => {
  const songData = {
    url,
    name,
    album,
    cover,
    artist,
    queueId
  };

  return (
    <div
      className={`vLanding__songs__list__item ${
        isPlaying ? 'item--playing' : ''
      }`}
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
        onClick={() => {
          showSongModal({
            cat,
            catId,
            ...songData
          });
        }}
        className='vLanding__songs__list__item__option'
      />
    </div>
  );
};

export default SongItem;
