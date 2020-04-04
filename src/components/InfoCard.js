import React from 'react';
import './InfoCard.css'
const InfoCard = ({ allAlbums, allSongs, handleListCardClick, cat }) => (
  <div className='vLanding__info'>
    <div className='vLanding__info__type'>
      <div className='vLanding__info__type__text'>
        {cat === 'artist' ? 'Albums' : 'Artists'}
      </div>
      <div
        data-img
        data-imgname='caret_down'
        className='vLanding__info__type__icon'
      />
    </div>
    <div className='vLanding__info__list'>
      <div
        className='vLanding__info__list__card vLanding__info__list__card--select'
        onClick={() => {
          handleListCardClick(0);
        }}
      >
        <div className='vLanding__info__list__card__wrapper'>
          <div className='vLanding__info__list__card__name'>
            All {cat === 'artist' ? 'albums' : 'artists'}
          </div>
          <div className='vLanding__info__list__card__highlight'></div>
        </div>
      </div>
      {allAlbums.val.map((a, k) => (
        <div
          key={k}
          className='vLanding__info__list__card'
          style={{ backgroundImage: `url(${a.albumArt})` }}
          onClick={() => {
            handleListCardClick(k + 1);
          }}
        >
          <div className='vLanding__info__list__card__wrapper'>
            <div className='vLanding__info__list__card__name'>
              <span>{a.albumName}</span>
            </div>
            <div className='vLanding__info__list__card__highlight'></div>
          </div>
        </div>
      ))}
      <div className='vLanding__info__list__clearFix'>.</div>
    </div>
    <div className='vLanding__info__msc'>
      <div className='vLanding__info__msc__numArtist'>
        {allAlbums.val.length} {cat === 'artist' ? 'albums' : 'album artists'}
      </div>
      <div className='vLanding__info__msc__numSongs'>
        {allSongs.val.length} songs
      </div>
    </div>
  </div>
);

export default InfoCard;
