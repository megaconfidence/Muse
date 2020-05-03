import React from 'react';
import { Link } from 'react-router-dom';
import './SongItem.css';
import { useContext } from 'react';
import AppContext from './hooks/AppContext';
import config from 'environment';
import useQueue from './hooks/useQueue';

const SongItem = ({ s, cat, catId, isPlaying, showSongModal }) => {
  const album = s.album ? s.album.name : null;
  const cover = s.album ? s.album.cover : null;
  const artist = s.artist ? s.artist.map((a) => a.name).join(' / ') : null;
  const [appData, setAppData] = useContext(AppContext);
  const { mutateQueue } = useQueue();

  return (
    <div
      className={`vLanding__songs__list__item noselect ${
        isPlaying ? 'item--playing' : ''
      }`}
    >
      <Link
        to={{
          pathname: `/play/${s._id}`
        }}
        onClick={() => {
          localStorage.setItem(`${config.appName}_PLAYING`, JSON.stringify(s));
          const recents = JSON.parse(
            localStorage.getItem(`${config.appName}_RECENTS`)
          );
          const song = s;
          delete song.cat;
          delete song.catId;
          delete song.queueId;
          delete song.catName;
          let temp = [];
          if (recents) {
            recents.push(song);
            temp = recents;
            localStorage.setItem(
              `${config.appName}_RECENTS`,
              JSON.stringify(recents)
            );
          } else {
            temp.push(song);
            localStorage.setItem(
              `${config.appName}_RECENTS`,
              JSON.stringify([song])
            );
          }

          if (cat === 'queues') {
            setAppData({ ...appData, playing: s, recents: temp });
          } else {
            mutateQueue('play', s, { ...appData, playing: s, recents: temp });
          }
        }}
      >
        <div
          className='vLanding__songs__list__item__img'
          style={{ backgroundImage: `url(${cover})` }}
        />
        <div className='vLanding__songs__list__item__text'>
          <div className='vLanding__songs__list__item__text__song truncate'>
            {s.name}
          </div>
          <div className='vLanding__songs__list__item__text__artist truncate'>
            {cat === 'artist' ? album : artist}
          </div>
        </div>
        <div className='vLanding__songs__list__item__duration'>{s.duration}</div>
      </Link>
      <div
        data-img
        data-imgname='menu'
        onClick={() => {
          showSongModal({
            ...s,
            catId,
            cat: cat
          });
        }}
        className='vLanding__songs__list__item__option'
      />
    </div>
  );
};

export default SongItem;
