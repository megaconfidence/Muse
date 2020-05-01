import './InfoCard.css';
import React from 'react';
import LazyLoad from 'react-lazyload';

const InfoCard = ({
  viewAlbumsDisplay,
  viewSongsDisplay,
  handleListCardClick,
  cat
}) => (
  <div className='vLanding__info'>
    <div className='vLanding__info__type'>
      <div className='vLanding__info__type__text'>
        {cat === 'artist' || cat === 'genre' ? 'Albums' : 'Artists'}
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
            All {cat === 'artist' || cat === 'genre' ? 'albums' : 'artists'}
          </div>
          <div className='vLanding__info__list__card__highlight'></div>
        </div>
      </div>
      {viewAlbumsDisplay.map((a, k) => (
        <LazyLoad overflow={true} key={k} placeholder={<div>***</div>}>
          <div
            onClick={() => {
              handleListCardClick(k + 1);
            }}
            className='vLanding__info__list__card'
            style={{ backgroundImage: `url(${a.cover})` }}
          >
            <div className='vLanding__info__list__card__wrapper'>
              <div className='vLanding__info__list__card__name'>
                <span>{a.name}</span>
              </div>
              <div className='vLanding__info__list__card__highlight'></div>
            </div>
          </div>
        </LazyLoad>
      ))}
      <div className='vLanding__info__list__clearFix'>.</div>
    </div>
    <div className='vLanding__info__msc'>
      <div className='vLanding__info__msc__numArtist'>
        {viewAlbumsDisplay.length}{' '}
        {cat === 'artist' || cat === 'genre' ? 'albums' : 'album artists'}
      </div>
      <div className='vLanding__info__msc__numSongs'>
        {viewSongsDisplay.length} songs
      </div>
    </div>
  </div>
);

export default InfoCard;
